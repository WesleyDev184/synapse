import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import {
  AnnouncementResponseDto,
  PaginatedAnnouncementsResponseDto,
} from './dto/response-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Announcement } from './entities/announcement.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
  ) {}

  async create(
    createAnnouncementDto: CreateAnnouncementDto,
    authorId: string,
  ): Promise<Announcement> {
    const announcement = this.announcementRepository.create({
      ...createAnnouncementDto,
      authorId,
    });

    return this.announcementRepository.save(announcement);
  }

  async findAll(
    page: number = 1,
    size: number = 10,
    search?: string,
    authorId?: string,
  ): Promise<PaginatedAnnouncementsResponseDto> {
    const queryBuilder =
      this.announcementRepository.createQueryBuilder('announcement');

    // Busca textual
    if (search) {
      queryBuilder.where(
        'announcement.title ILIKE :search OR announcement.content ILIKE :search',
        { search: `%${search}%` },
      );
    }

    // Filtrar por autor
    if (authorId) {
      queryBuilder.andWhere('announcement.authorId = :authorId', { authorId });
    }

    queryBuilder
      .leftJoinAndSelect('announcement.author', 'author')
      .orderBy('announcement.createdAt', 'DESC')
      .skip((page - 1) * size)
      .take(size);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data: data.map((ann) => this.mapToResponseDto(ann)),
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
    };
  }

  async findOne(id: string): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return announcement;
  }

  async findByAuthor(authorId: string): Promise<Announcement[]> {
    return this.announcementRepository.find({
      where: { authorId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    const announcement = await this.findOne(id);
    Object.assign(announcement, updateAnnouncementDto);
    return this.announcementRepository.save(announcement);
  }

  async remove(id: string): Promise<void> {
    const announcement = await this.findOne(id);
    await this.announcementRepository.remove(announcement);
  }

  /**
   * Helper: Mapear entidade para DTO
   */
  private mapToResponseDto(
    announcement: Announcement,
  ): AnnouncementResponseDto {
    const dto = new AnnouncementResponseDto();
    dto.id = announcement.id;
    dto.title = announcement.title;
    dto.content = announcement.content;
    dto.authorId = announcement.authorId;
    dto.author = announcement.author;
    dto.createdAt = announcement.createdAt;
    return dto;
  }
}
