import { Referral } from '@modules/referrals/entities/referral.entity';
import { User } from '@modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ThankYou {
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
  description: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column('text', { nullable: true })
  referralId: string;

  @ManyToOne(() => Referral, { nullable: true })
  @JoinColumn({ name: 'referralId' })
  referral: Referral;

  @CreateDateColumn()
  createdAt: Date;
}
