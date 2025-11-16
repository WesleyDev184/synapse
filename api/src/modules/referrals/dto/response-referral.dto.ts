import { User } from '@modules/users/entities/user.entity';
import { ReferralStatus } from '../entities/referral.entity';

export class ReferralResponseDto {
  id: string;
  fromMemberId: string;
  fromMember?: User;
  toMemberId: string;
  toMember?: User;
  contactName: string;
  contactEmail?: string;
  company?: string;
  description: string;
  status: ReferralStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class PaginatedReferralsResponseDto {
  data: ReferralResponseDto[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}
