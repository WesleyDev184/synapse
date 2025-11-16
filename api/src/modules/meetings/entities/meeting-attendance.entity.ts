import { User } from '@modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meeting } from './meeting.entity';

@Entity()
export class MeetingAttendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  memberId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'memberId' })
  member: User;

  @Column('text')
  meetingId: string;

  @ManyToOne(() => Meeting, (meeting) => meeting.attendances)
  @JoinColumn({ name: 'meetingId' })
  meeting: Meeting;

  @CreateDateColumn()
  checkedInAt: Date;
}
