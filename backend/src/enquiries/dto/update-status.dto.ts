import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EnquiryStatus } from '../../generated/prisma/enums';

export class UpdateStatusDto {
  @ApiProperty({
    enum: EnquiryStatus,
  })
  @IsEnum(EnquiryStatus)
  status: EnquiryStatus;
}
