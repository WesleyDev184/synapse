import { IsEnum, IsOptional } from 'class-validator';
import { InviteStatus } from '../entities/invite.entity';

export class UpdateInviteDto {
  @IsOptional()
  @IsEnum(InviteStatus)
  status?: InviteStatus;
}
