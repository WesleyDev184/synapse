import { MeetingAttendance } from '../entities/meeting-attendance.entity';

export class MeetingResponseDto {
  id: string;
  title: string;
  date: Date;
  attendances?: MeetingAttendance[];
  createdAt: Date;
}

export class PaginatedMeetingsResponseDto {
  data: MeetingResponseDto[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}
