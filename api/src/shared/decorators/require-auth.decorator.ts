import { UseInterceptors } from '@nestjs/common';
import { AuthInterceptor } from '@shared/interceptors/auth.interceptor';

export function RequireAuth() {
  return UseInterceptors(AuthInterceptor);
}
