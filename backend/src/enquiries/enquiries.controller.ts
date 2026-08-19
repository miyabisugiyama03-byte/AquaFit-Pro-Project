import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import { Role } from '../generated/prisma/enums';

import { AuthenticatedRequest } from '../auth/authenticated-request.interface';

import { EnquiriesService } from './enquiries.service';

import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { QueryEnquiriesDto } from './dto/query-enquiries.dto';

@ApiTags('Enquiries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  /**
   * Create a new enquiry
   */
  @Post()
  @Roles(Role.MEMBER, Role.INSTRUCTOR, Role.ADMIN)
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateEnquiryDto) {
    return this.enquiriesService.createEnquiry(req.user.userId, dto);
  }

  /**
   * View your own enquiries
   */
  @Get('me')
  @Roles(Role.MEMBER, Role.INSTRUCTOR, Role.ADMIN)
  getMine(@Req() req: AuthenticatedRequest) {
    return this.enquiriesService.getMyEnquiries(req.user.userId);
  }

  /**
   * View a conversation
   */
  @Get(':id')
  @Roles(Role.MEMBER, Role.INSTRUCTOR, Role.ADMIN)
  getOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.enquiriesService.getEnquiry(id, req.user.userId, req.user.role);
  }

  /**
   * Reply to an enquiry
   */
  @Post(':id/messages')
  @Roles(Role.MEMBER, Role.INSTRUCTOR, Role.ADMIN)
  addMessage(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateMessageDto,
  ) {
    return this.enquiriesService.addMessage(
      id,
      req.user.userId,
      req.user.role,
      dto,
    );
  }

  /**
   * Admin - View every enquiry
   */
  @Get()
  @Roles(Role.ADMIN)
  getAll(@Query() query: QueryEnquiriesDto) {
    return this.enquiriesService.getAllEnquiries(query);
  }

  /**
   * Admin - Update enquiry status
   */
  @Patch(':id/status')
  @Roles(Role.ADMIN)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.enquiriesService.updateStatus(id, dto);
  }

  /**
   * Admin - Reopen enquiry
   */
  @Patch(':id/reopen')
  @Roles(Role.ADMIN)
  reopen(@Param('id', ParseIntPipe) id: number) {
    return this.enquiriesService.reopenEnquiry(id);
  }
}
