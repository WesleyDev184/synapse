import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invite } from './entities/invite.entity';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { InvitesSubscriber } from './invites.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Invite]), AuthModule, UsersModule],
  controllers: [InvitesController],
  providers: [InvitesService, InvitesSubscriber],
  exports: [InvitesService],
})
export class InvitesModule {}
