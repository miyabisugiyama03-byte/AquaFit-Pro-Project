import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateEnquiryDto {
  @ApiProperty({
    example: 'Payment Question',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  subject: string;

  @ApiProperty({
    example: 'I have been charged twice.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message: string;
}
