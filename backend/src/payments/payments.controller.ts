import {
  Controller,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { AuthenticatedRequest } from '../auth/authenticated-request.interface';
import { Public } from '../auth/public.decorator';

type RawBodyRequest = Request & {
  rawBody: Buffer;
};

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('checkout/:bookingId')
  createCheckoutSession(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.paymentsService.createCheckoutSession(
      bookingId,
      req.user.userId,
    );
  }

  @Public()
  @Post('webhook')
  handleWebhook(
    @Req() req: RawBodyRequest,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleWebhook(req.rawBody, signature);
  }
}
