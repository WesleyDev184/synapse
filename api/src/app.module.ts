import { AuthModule } from '@modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { ApplicationModule } from './modules/application/application.module';
import { InvitesModule } from './modules/invites/invites.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { MembershipPaymentsModule } from './modules/membership_payments/membership_payments.module';
import { OneOnOneMeetingModule } from './modules/one_on_one_meeting/one_on_one_meeting.module';
import { ReferralsModule } from './modules/referrals/referrals.module';
import { ThankYouModule } from './modules/thank_you/thank_you.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './shared/database/database.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000, // 1 segundo em milissegundos
        limit: 10, // 10 requisições
      },
    ]),
    UsersModule,
    ApplicationModule,
    InvitesModule,
    ReferralsModule,
    ThankYouModule,
    OneOnOneMeetingModule,
    MembershipPaymentsModule,
    AnnouncementsModule,
    MeetingsModule,
    NotificationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
