import { IsInt, Min } from 'class-validator';

export class AddCreditDto {
  @IsInt()
  @Min(1)
  amountCents: number;
}
