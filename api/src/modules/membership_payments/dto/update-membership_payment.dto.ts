import { PartialType } from '@nestjs/swagger';
import { CreateMembershipPaymentDto } from './create-membership_payment.dto';

export class UpdateMembershipPaymentDto extends PartialType(CreateMembershipPaymentDto) {}
