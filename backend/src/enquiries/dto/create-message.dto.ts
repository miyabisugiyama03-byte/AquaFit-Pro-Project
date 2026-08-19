import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 'Thank you for letting us know.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message: string;
}
