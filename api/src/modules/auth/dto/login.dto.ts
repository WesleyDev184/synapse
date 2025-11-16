import { ResponseUserDto } from '@modules/users/dto/response-user.dto';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class ResponseTokensDto {
  accessToken: string;
  refreshToken: string;
}

export class ResponseValidateTokenDto {
  valid: boolean;
  user: ResponseUserDto;
}
