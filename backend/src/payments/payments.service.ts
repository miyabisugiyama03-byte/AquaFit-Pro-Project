import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import StripeConstructor from 'stripe';

import { PrismaService } from '../prisma/prisma.service';
import { BookingsService } from '../bookings/bookings.service';
import { Prisma } from '../generated/prisma/client';

type StripeClient = InstanceType<typeof StripeConstructor>;

type BookingForCheckout = Prisma.BookingGetPayload<{
  include: {
    block: {
      include: {
        course: true;
      };
    };
  };
}>;

interface StripeCheckoutSessionMetadata {
  metadata?: {
    bookingId?: string;
  } | null;
}

function hasBookingMetadata(
  value: unknown,
): value is StripeCheckoutSessionMetadata {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return 'metadata' in value;
}

@Injectable()
export class PaymentsService {
  private readonly stripe: StripeClient;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly bookingsService: BookingsService,
  ) {
    const secretKey = this.config.get<string>('STRIPE_SECRET_KEY');

    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new StripeConstructor(secretKey);
  }

  async createCheckoutSession(
    bookingId: number,
    userId: number,
  ): Promise<{ url: string | null }> {
    const booking: BookingForCheckout | null =
      await this.prisma.booking.findFirst({
        where: {
          id: bookingId,
          userId,
        },
        include: {
          block: {
            include: {
              course: true,
            },
          },
        },
      });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const frontendUrl =
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:5173';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: 1500,
            product_data: {
              name: booking.block.course.title,
              description: `${booking.block.dayOfWeek} at ${booking.block.time}`,
            },
          },
        },
      ],
      metadata: {
        bookingId: booking.id.toString(),
      },
      success_url: `${frontendUrl}/member?payment=success`,
      cancel_url: `${frontendUrl}/member?payment=cancelled`,
    });

    return {
      url: session.url,
    };
  }

  async handleWebhook(
    rawBody: Buffer,
    signature: string,
  ): Promise<{ received: boolean }> {
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }

    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );

    if (event.type === 'checkout.session.completed') {
      const sessionData: unknown = event.data.object;

      if (!hasBookingMetadata(sessionData)) {
        return { received: true };
      }

      const bookingId = Number(sessionData.metadata?.bookingId);

      if (bookingId) {
        await this.bookingsService.markAsPaid(bookingId);
      }
    }

    return { received: true };
  }
}
