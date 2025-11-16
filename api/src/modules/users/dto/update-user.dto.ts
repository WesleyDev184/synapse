import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRole, UserStatus } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role deve ser MEMBER ou ADMIN' })
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus, {
    message: 'Status deve ser PENDING_INVITE, ACTIVE ou INACTIVE',
  })
  status?: UserStatus;
}
