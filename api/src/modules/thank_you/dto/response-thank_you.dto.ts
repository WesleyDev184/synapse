import { Referral } from '@modules/referrals/entities/referral.entity';
import { User } from '@modules/users/entities/user.entity';

export class ThankYouResponseDto {
  id: string;
  fromMemberId: string;
  fromMember?: User;
  toMemberId: string;
  toMember?: User;
  description: string;
  amount?: number;
  referralId?: string;
  referral?: Referral;
  createdAt: Date;
}

export class PaginatedThankYouResponseDto {
  data: ThankYouResponseDto[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}
