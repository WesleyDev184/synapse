import { Announcement } from '@modules/announcements/entities/announcement.entity';
import { Application } from '@modules/application/entities/application.entity';
import { Invite } from '@modules/invites/entities/invite.entity';
import { MeetingAttendance } from '@modules/meetings/entities/meeting-attendance.entity';
import { Meeting } from '@modules/meetings/entities/meeting.entity';
import { MembershipPayment } from '@modules/membership_payments/entities/membership_payment.entity';
import { OneOnOneMeeting } from '@modules/one_on_one_meeting/entities/one_on_one_meeting.entity';
import { Referral } from '@modules/referrals/entities/referral.entity';
import { ThankYou } from '@modules/thank_you/entities/thank_you.entity';
import { User } from '@modules/users/entities/user.entity';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST', 'localhost');
        const port = configService.get<number>('DB_PORT', 5432);
        const username = configService.get<string>('DB_USERNAME', 'postgres');
        const password = configService.get<string>('DB_PASSWORD', 'password');
        const database = configService.get<string>('DB_NAME', 'synapse_db');

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [
            User,
            Announcement,
            Application,
            Invite,
            Meeting,
            MeetingAttendance,
            MembershipPayment,
            OneOnOneMeeting,
            Referral,
            ThankYou,
          ],
          synchronize: true,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
