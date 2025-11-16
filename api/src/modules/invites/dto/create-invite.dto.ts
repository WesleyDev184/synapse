import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateInviteDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  applicationId: string;
}
