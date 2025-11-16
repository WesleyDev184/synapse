import { Application } from '@modules/application/entities/application.entity';
import { InviteStatus } from '../entities/invite.entity';

export class InviteResponseDto {
  id: string;
  email: string;
  token: string;
  expiresAt: Date;
  status: InviteStatus;
  applicationId: string;
  application?: Application;
  createdAt: Date;
}

export class PaginatedInvitesResponseDto {
  data: InviteResponseDto[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}
