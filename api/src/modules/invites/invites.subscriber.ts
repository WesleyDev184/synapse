import { Inject } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Invite } from './entities/invite.entity';

@EventSubscriber()
export class InvitesSubscriber implements EntitySubscriberInterface<Invite> {
  constructor(@Inject(DataSource) dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Invite;
  }

  afterInsert(event: InsertEvent<Invite>) {
    const data = event.entity;
    // simular envio de email de convite
    console.log(
      `Invite email sent to ${data.email} with url to redirect: http://example.com/auth/invite?token=${data.token}`,
    );
  }
}
