import { IsDateString, IsInt, IsString, Min } from 'class-validator';

export class CreateBlockDto {
  @IsInt()
  @Min(1)
  courseId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  dayOfWeek: string;

  @IsString()
  time: string;
}
