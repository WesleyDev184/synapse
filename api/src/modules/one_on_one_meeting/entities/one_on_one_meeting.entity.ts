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
export class OneOnOneMeeting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  member1Id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'member1Id' })
  member1: User;

  @Column('text')
  member2Id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'member2Id' })
  member2: User;

  @Column('timestamp')
  date: Date;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
