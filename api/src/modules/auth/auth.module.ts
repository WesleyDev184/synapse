import { AuthGuard } from '@modules/auth/auth.guard';
import { forwardRef, Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthInterceptor } from '@shared/interceptors/auth.interceptor';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

const authGuardProvider: Provider = {
  provide: AuthGuard,
  useFactory: (authService: AuthService) => new AuthGuard(authService),
  inject: [AuthService],
};

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret-key',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, authGuardProvider, AuthInterceptor],
  exports: [AuthGuard, AuthService, JwtModule, AuthInterceptor],
})
export class AuthModule {}
