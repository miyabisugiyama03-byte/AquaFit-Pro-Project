import { IsDateString, IsEnum, IsInt, IsString, Min } from 'class-validator';
import { SessionsPerWeek, SkillLevel } from '../../generated/prisma/enums';

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

  @IsEnum(SkillLevel)
  skillLevel: SkillLevel;

  @IsEnum(SessionsPerWeek)
  sessionsPerWeek: SessionsPerWeek;
}
