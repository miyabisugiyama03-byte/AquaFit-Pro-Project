import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '../generated/prisma/enums';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // Create booking (PENDING until payment)
  async createBooking(userId: number, blockId: number) {
    const block = await this.prisma.block.findFirst({
      where: {
        id: blockId,
        isActive: true,
        course: {
          isActive: true,
        },
      },
      include: {
        bookings: true,
        course: true,
      },
    });

    if (!block) {
      throw new NotFoundException('Block not found');
    }

    // Prevent booking after block starts
    if (block.startDate < new Date()) {
      throw new BadRequestException('This block has already started');
    }

    // Prevent duplicate active booking
    const existing = block.bookings.find(
      (b) => b.userId === userId && b.status !== BookingStatus.CANCELLED,
    );

    if (existing) {
      throw new BadRequestException('You already booked this block');
    }

    // Only count PAID bookings for capacity
    const paidBookings = block.bookings.filter(
      (b) => b.status === BookingStatus.PAID,
    );

    if (paidBookings.length >= block.course.capacity) {
      throw new BadRequestException('Block is full');
    }

    return this.prisma.booking.create({
      data: {
        userId,
        blockId,
        status: BookingStatus.PENDING,
      },
    });
  }

  // Confirm booking after payment
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

    if (!booking.block.isActive || !booking.block.course.isActive) {
      throw new BadRequestException('This booking is no longer valid');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Cancelled bookings cannot be paid');
    }

    if (booking.status === BookingStatus.PAID) {
      return booking;
    }

    const paidBookings = booking.block.bookings.filter(
      (b) => b.status === BookingStatus.PAID,
    );

    if (paidBookings.length >= booking.block.course.capacity) {
      throw new BadRequestException('Block is full');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.PAID,
      },
    });
  }

  // Cancel booking
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

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.block.startDate < new Date()) {
      throw new BadRequestException(
        'Cannot cancel after the block has started',
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

  // Get current user bookings
  async getMyBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: {
        userId,
        block: {
          isActive: true,
          course: {
            isActive: true,
          },
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

  // Instructor/Admin: view bookings for a block
  async getBlockBookings(blockId: number, requesterRole: string) {
    if (requesterRole !== 'ADMIN' && requesterRole !== 'INSTRUCTOR') {
      throw new ForbiddenException('Not allowed');
    }

    const block = await this.prisma.block.findFirst({
      where: {
        id: blockId,
        isActive: true,
        course: {
          isActive: true,
        },
      },
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

  // Clean up expired unpaid bookings
  async cleanupExpiredBookings() {
    const expiryTime = new Date(Date.now() - 15 * 60 * 1000);

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
