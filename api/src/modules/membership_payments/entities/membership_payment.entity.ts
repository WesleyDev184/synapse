import { User } from '@modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

@Entity()
export class MembershipPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  memberId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'memberId' })
  member: User;

  @Column('timestamp')
  dueDate: Date;

  @Column('timestamp', { nullable: true })
  paidAt: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @CreateDateColumn()
  createdAt: Date;
}
