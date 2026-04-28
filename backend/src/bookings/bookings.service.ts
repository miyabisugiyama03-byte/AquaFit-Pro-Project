import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '../generated/prisma/enums';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

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

    if (block.startDate < new Date()) {
      throw new BadRequestException('This block has already started');
    }

    const existingBooking = block.bookings.find(
      (booking) => booking.userId === userId,
    );

    if (existingBooking && existingBooking.status !== BookingStatus.CANCELLED) {
      throw new BadRequestException('You already booked this block');
    }

    const paidBookings = block.bookings.filter(
      (booking) => booking.status === BookingStatus.PAID,
    );

    if (paidBookings.length >= block.course.capacity) {
      throw new BadRequestException('Block is full');
    }

    if (existingBooking && existingBooking.status === BookingStatus.CANCELLED) {
      return this.prisma.booking.update({
        where: {
          userId_blockId: {
            userId,
            blockId,
          },
        },
        data: {
          status: BookingStatus.PENDING,
          createdAt: new Date(),
        },
      });
    }

    return this.prisma.booking.create({
      data: {
        userId,
        blockId,
        status: BookingStatus.PENDING,
      },
    });
  }

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
      (blockBooking) => blockBooking.status === BookingStatus.PAID,
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

  async getMyBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: {
        userId,
        status: {
          not: BookingStatus.CANCELLED,
        },
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
