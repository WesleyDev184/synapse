import { AuthModule } from '@modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OneOnOneMeeting } from './entities/one_on_one_meeting.entity';
import { OneOnOneMeetingController } from './one_on_one_meeting.controller';
import { OneOnOneMeetingService } from './one_on_one_meeting.service';

@Module({
  imports: [TypeOrmModule.forFeature([OneOnOneMeeting]), AuthModule],
  controllers: [OneOnOneMeetingController],
  providers: [OneOnOneMeetingService],
  exports: [OneOnOneMeetingService],
})
export class OneOnOneMeetingModule {}
