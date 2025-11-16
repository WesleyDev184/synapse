import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  reason: string;
}
