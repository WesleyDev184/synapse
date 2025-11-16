import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import {
  LoginDto,
  ResponseTokensDto,
  ResponseValidateTokenDto,
} from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ResponseTokensDto> {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.passwordHash) {
      throw new HttpException('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return tokens;
  }

  async validateToken(token: string): Promise<ResponseValidateTokenDto> {
    try {
      const payload = await this.jwtService.verifyAsync(token);

      const user = await this.usersService.findOne(payload.sub);

      return {
        valid: true,
        user,
      };
    } catch (error) {
      throw new HttpException('Invalid token', 401);
    }
  }

  async refreshToken(token: string): Promise<ResponseTokensDto> {
    try {
      const payload = await this.jwtService.verifyAsync(token);

      const tokens = await this.generateTokens(payload.sub, payload.email);

      return tokens;
    } catch (error) {
      throw new HttpException('Invalid refresh token', 401);
    }
  }

  async generateTokens(
    userId: string,
    email: string,
  ): Promise<ResponseTokensDto> {
    const payload = { email, sub: userId };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
  }
}
