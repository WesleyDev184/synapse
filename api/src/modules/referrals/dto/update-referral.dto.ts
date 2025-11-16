import { IsEnum, IsOptional } from 'class-validator';
import { ReferralStatus } from '../entities/referral.entity';

export class UpdateReferralDto {
  @IsOptional()
  @IsEnum(ReferralStatus)
  status?: ReferralStatus;
}
