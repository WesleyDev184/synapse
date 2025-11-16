import { UserRole, UserStatus } from '../entities/user.entity';

export class ResponseUserDto {
  id: string;

  name: string;

  email: string;

  company?: string;

  role: UserRole;

  status: UserStatus;

  createdAt: Date;

  updatedAt?: Date;
}

export class PaginatedUsersResponseDto {
  page: number;

  size: number;

  total: number;

  totalPages: number;

  data: ResponseUserDto[];
}

export class MessageResponseDto {
  message: string;
}

export class CreateUserResponseDto extends ResponseUserDto {}

export class UpdateUserResponseDto extends ResponseUserDto {}

export class DeleteUserResponseDto {
  message: string;
  id: string;
}

export class ValidateUsersResponseDto {
  validIds: string[];
  count: number;
}

export class UserEmailsResponseDto {
  emails: string[];
  count: number;
}

export class FindByEmailResponseDto {
  id: string;
  email: string;
  passwordHash: string;
}
