import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOneOnOneMeetingDto } from './dto/create-one_on_one_meeting.dto';
import {
  OneOnOneMeetingResponseDto,
  PaginatedOneOnOneMeetingsResponseDto,
} from './dto/response-one_on_one_meeting.dto';
import { UpdateOneOnOneMeetingDto } from './dto/update-one_on_one_meeting.dto';
import { OneOnOneMeeting } from './entities/one_on_one_meeting.entity';

@Injectable()
export class OneOnOneMeetingService {
  constructor(
    @InjectRepository(OneOnOneMeeting)
    private readonly meetingRepository: Repository<OneOnOneMeeting>,
  ) {}

  async create(
    createOneOnOneMeetingDto: CreateOneOnOneMeetingDto,
    member1Id: string,
  ): Promise<OneOnOneMeeting> {
    const meeting = this.meetingRepository.create({
      ...createOneOnOneMeetingDto,
      member1Id,
      date: new Date(createOneOnOneMeetingDto.date),
    });

    return this.meetingRepository.save(meeting);
  }

  async findAll(
    page: number = 1,
    size: number = 10,
    memberId?: string,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<PaginatedOneOnOneMeetingsResponseDto> {
    const queryBuilder = this.meetingRepository.createQueryBuilder('meeting');

    // Filtrar por membro
    if (memberId) {
      queryBuilder.where(
        '(meeting.member1Id = :memberId OR meeting.member2Id = :memberId)',
        { memberId },
      );
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
      .leftJoinAndSelect('meeting.member1', 'member1')
      .leftJoinAndSelect('meeting.member2', 'member2')
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

  async findOne(id: string): Promise<OneOnOneMeeting> {
    const meeting = await this.meetingRepository.findOne({
      where: { id },
      relations: ['member1', 'member2'],
    });

    if (!meeting) {
      throw new NotFoundException('One-on-one meeting not found');
    }

    return meeting;
  }

  async findByMember(memberId: string): Promise<OneOnOneMeeting[]> {
    return this.meetingRepository.find({
      where: [{ member1Id: memberId }, { member2Id: memberId }],
      relations: ['member1', 'member2'],
      order: { date: 'DESC' },
    });
  }

  async update(
    id: string,
    updateOneOnOneMeetingDto: UpdateOneOnOneMeetingDto,
  ): Promise<OneOnOneMeeting> {
    const meeting = await this.findOne(id);
    if (updateOneOnOneMeetingDto.date) {
      updateOneOnOneMeetingDto.date = new Date(
        updateOneOnOneMeetingDto.date,
      ).toISOString();
    }
    Object.assign(meeting, updateOneOnOneMeetingDto);
    return this.meetingRepository.save(meeting);
  }

  async remove(id: string): Promise<void> {
    const meeting = await this.findOne(id);
    await this.meetingRepository.remove(meeting);
  }

  /**
   * Helper: Mapear entidade para DTO
   */
  private mapToResponseDto(
    meeting: OneOnOneMeeting,
  ): OneOnOneMeetingResponseDto {
    const dto = new OneOnOneMeetingResponseDto();
    dto.id = meeting.id;
    dto.member1Id = meeting.member1Id;
    dto.member1 = meeting.member1;
    dto.member2Id = meeting.member2Id;
    dto.member2 = meeting.member2;
    dto.date = meeting.date;
    dto.notes = meeting.notes;
    dto.createdAt = meeting.createdAt;
    return dto;
  }
}
