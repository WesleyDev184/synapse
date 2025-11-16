import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import {
  MeetingResponseDto,
  PaginatedMeetingsResponseDto,
} from './dto/response-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { MeetingAttendance } from './entities/meeting-attendance.entity';
import { Meeting } from './entities/meeting.entity';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
    @InjectRepository(MeetingAttendance)
    private readonly attendanceRepository: Repository<MeetingAttendance>,
  ) {}

  async create(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    const meeting = this.meetingRepository.create({
      ...createMeetingDto,
      date: new Date(createMeetingDto.date),
    });

    return this.meetingRepository.save(meeting);
  }

  async findAll(
    page: number = 1,
    size: number = 10,
    search?: string,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<PaginatedMeetingsResponseDto> {
    const queryBuilder = this.meetingRepository.createQueryBuilder('meeting');

    // Busca textual
    if (search) {
      queryBuilder.where('meeting.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    // Filtro de data inicial
    if (dateFrom) {
      queryBuilder.andWhere('meeting.date >= :dateFrom', {
        dateFrom: new Date(dateFrom),
      });
    }

    // Filtro de data final
    if (dateTo) {
      queryBuilder.andWhere('meeting.date <= :dateTo', {
        dateTo: new Date(dateTo),
      });
    }

    queryBuilder
      .leftJoinAndSelect('meeting.attendances', 'attendances')
      .leftJoinAndSelect('attendances.member', 'member')
      .orderBy('meeting.date', 'DESC')
      .skip((page - 1) * size)
      .take(size);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data: data.map((meeting) => this.mapToResponseDto(meeting)),
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
    };
  }

  async findOne(id: string): Promise<Meeting> {
    const meeting = await this.meetingRepository.findOne({
      where: { id },
      relations: ['attendances', 'attendances.member'],
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    return meeting;
  }

  async update(
    id: string,
    updateMeetingDto: UpdateMeetingDto,
  ): Promise<Meeting> {
    const meeting = await this.findOne(id);
    if (updateMeetingDto.date) {
      updateMeetingDto.date = new Date(updateMeetingDto.date).toISOString();
    }
    Object.assign(meeting, updateMeetingDto);
    return this.meetingRepository.save(meeting);
  }

  async remove(id: string): Promise<void> {
    const meeting = await this.findOne(id);
    await this.meetingRepository.remove(meeting);
  }

  async addAttendance(
    meetingId: string,
    memberId: string,
  ): Promise<MeetingAttendance> {
    const meeting = await this.findOne(meetingId);

    const existingAttendance = await this.attendanceRepository.findOne({
      where: { meetingId, memberId },
    });

    if (existingAttendance) {
      return existingAttendance;
    }

    const attendance = this.attendanceRepository.create({
      meetingId,
      memberId,
    });

    return this.attendanceRepository.save(attendance);
  }

  async removeAttendance(attendanceId: string): Promise<void> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id: attendanceId },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    await this.attendanceRepository.remove(attendance);
  }

  async getMeetingAttendees(meetingId: string): Promise<MeetingAttendance[]> {
    return this.attendanceRepository.find({
      where: { meetingId },
      relations: ['member'],
    });
  }

  /**
   * Helper: Mapear entidade para DTO
   */
  private mapToResponseDto(meeting: Meeting): MeetingResponseDto {
    const dto = new MeetingResponseDto();
    dto.id = meeting.id;
    dto.title = meeting.title;
    dto.date = meeting.date;
    dto.attendances = meeting.attendances;
    dto.createdAt = meeting.createdAt;
    return dto;
  }
}
