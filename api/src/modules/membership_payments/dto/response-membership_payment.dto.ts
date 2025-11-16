import { User } from '@modules/users/entities/user.entity';
import { PaymentStatus } from '../entities/membership_payment.entity';

export class MembershipPaymentResponseDto {
  id: string;
  memberId: string;
  member?: User;
  dueDate: Date;
  paidAt?: Date;
  amount: number;
  status: PaymentStatus;
  createdAt: Date;
}

export class PaginatedMembershipPaymentsResponseDto {
  data: MembershipPaymentResponseDto[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}
