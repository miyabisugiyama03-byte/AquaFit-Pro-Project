import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BookingsCleanup } from './bookings.cleanup';

@Module({
  imports: [PrismaModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsCleanup],
  exports: [BookingsService],
})
export class BookingsModule {}
