import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateReferralDto {
  @IsNotEmpty()
  @IsString()
  toMemberId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  contactName: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  description: string;
}
