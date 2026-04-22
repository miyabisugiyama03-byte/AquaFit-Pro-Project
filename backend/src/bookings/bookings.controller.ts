import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  Get,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { AuthenticatedRequest } from '../auth/authenticated-request.interface';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post('course/:courseId')
  bookCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.bookingsService.createBooking(req.user.userId, courseId);
  }

  @Get('me')
  getMyBookings(@Req() req: AuthenticatedRequest) {
    return this.bookingsService.getMyBookings(req.user.userId);
  }

  @Delete('course/:courseId')
  cancel(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.bookingsService.cancelBooking(req.user.userId, courseId);
  }
}
