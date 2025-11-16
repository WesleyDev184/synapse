import { PartialType } from '@nestjs/swagger';
import { CreateOneOnOneMeetingDto } from './create-one_on_one_meeting.dto';

export class UpdateOneOnOneMeetingDto extends PartialType(CreateOneOnOneMeetingDto) {}
