import { PartialType } from '@nestjs/swagger';
import { CreateThankYouDto } from './create-thank_you.dto';

export class UpdateThankYouDto extends PartialType(CreateThankYouDto) {}
