import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BookingsService } from './bookings.service';

@Injectable()
export class BookingsCleanup {
  private readonly logger = new Logger(BookingsCleanup.name);

  constructor(private readonly bookingsService: BookingsService) {}

  @Cron('*/1 * * * *') // every 5 minutes
  async handleCleanup() {
    const result = await this.bookingsService.cleanupExpiredBookings();

    if (result.count > 0) {
      this.logger.log(`Cleaned up ${result.count} expired bookings`);
    }
  }
}
