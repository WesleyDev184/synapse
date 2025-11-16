import { User } from '@modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ReferralStatus {
  SENT = 'SENT',
  NEGOTIATING = 'NEGOTIATING',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED',
}

@Entity()
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fromMemberId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'fromMemberId' })
  fromMember: User;

  @Column('text')
  toMemberId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'toMemberId' })
  toMember: User;

  @Column('text')
  contactName: string;

  @Column('text', { nullable: true })
  contactEmail: string;

  @Column('text', { nullable: true })
  company: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ReferralStatus,
    default: ReferralStatus.SENT,
  })
  status: ReferralStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
