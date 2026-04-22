import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '../generated/prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  //Create booking (PENDING until payment)
  async createBooking(userId: number, blockId: number) {
    const block = await this.prisma.block.findUnique({
      where: { id: blockId },
      include: {
        bookings: true,
        course: true,
      },
    });

    if (!block) {
      throw new NotFoundException('Block not found');
    }

    //Prevent booking after course starts
    if (block.startDate < new Date()) {
      throw new BadRequestException('This class has already started');
    }

    // Prevent duplicate booking
    const existing = block.bookings.find((b) => b.userId === userId);

    if (existing) {
      throw new BadRequestException('You already booked this class');
    }

    // Only count PAID bookings for capacity
    const confirmedBookings = block.bookings.filter(
      (b) => b.status === BookingStatus.PAID,
    );

    if (confirmedBookings.length >= block.course.capacity) {
      throw new BadRequestException('Class is full');
    }

    //Create booking (PENDING)
    return this.prisma.booking.create({
      data: {
        userId,
        blockId,
        status: BookingStatus.PENDING,
      },
    });
  }

  //Confirm booking after payment (you’ll call this later with Stripe)
  async markAsPaid(bookingId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        block: {
          include: {
            bookings: true,
            course: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    //Check capacity again before confirming
    const confirmedBookings = booking.block.bookings.filter(
      (b) => b.status === BookingStatus.PAID,
    );

    if (confirmedBookings.length >= booking.block.course.capacity) {
      throw new BadRequestException('Class is full');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.PAID,
      },
    });
  }

  //Cancel booking
  async cancelBooking(userId: number, blockId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        userId_blockId: {
          userId,
          blockId,
        },
      },
      include: {
        block: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    //Prevent cancel after start
    if (booking.block.startDate < new Date()) {
      throw new BadRequestException(
        'Cannot cancel after the class has started',
      );
    }

    return this.prisma.booking.update({
      where: {
        userId_blockId: {
          userId,
          blockId,
        },
      },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });
  }

  //Get current user bookings
  async getMyBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: {
        userId,
        status: {
          not: BookingStatus.CANCELLED,
        },
      },
      include: {
        block: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  //Instructor/Admin: view bookings for a block
  async getBlockBookings(blockId: number, requesterRole: string) {
    if (requesterRole !== 'ADMIN' && requesterRole !== 'INSTRUCTOR') {
      throw new ForbiddenException('Not allowed');
    }

    const block = await this.prisma.block.findUnique({
      where: { id: blockId },
      include: {
        course: true,
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!block) {
      throw new NotFoundException('Block not found');
    }

    return block;
  }

  //clean up expired unpaid bookings
  async cleanupExpiredBookings() {
    const expiryTime = new Date(Date.now() - 15 * 60 * 1000); // 15 mins

    return this.prisma.booking.updateMany({
      where: {
        status: BookingStatus.PENDING,
        createdAt: {
          lt: expiryTime,
        },
      },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });
  }
}
