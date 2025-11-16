import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MeetingAttendance } from './meeting-attendance.entity';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('timestamp')
  date: Date;

  @OneToMany(() => MeetingAttendance, (attendance) => attendance.meeting, {
    cascade: true,
  })
  attendances: MeetingAttendance[];

  @CreateDateColumn()
  createdAt: Date;
}
