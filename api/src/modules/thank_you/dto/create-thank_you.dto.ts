import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateThankYouDto {
  @IsNotEmpty()
  @IsString()
  toMemberId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsString()
  referralId?: string;
}
