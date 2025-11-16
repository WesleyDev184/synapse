import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateThankYouDto } from './dto/create-thank_you.dto';
import {
  PaginatedThankYouResponseDto,
  ThankYouResponseDto,
} from './dto/response-thank_you.dto';
import { UpdateThankYouDto } from './dto/update-thank_you.dto';
import { ThankYou } from './entities/thank_you.entity';

@Injectable()
export class ThankYouService {
  constructor(
    @InjectRepository(ThankYou)
    private readonly thankYouRepository: Repository<ThankYou>,
  ) {}

  async create(
    createThankYouDto: CreateThankYouDto,
    fromMemberId: string,
  ): Promise<ThankYou> {
    const thankYou = this.thankYouRepository.create({
      ...createThankYouDto,
      fromMemberId,
    });

    return this.thankYouRepository.save(thankYou);
  }

  async findAll(
    page: number = 1,
    size: number = 10,
    memberId?: string,
  ): Promise<PaginatedThankYouResponseDto> {
    const queryBuilder = this.thankYouRepository.createQueryBuilder('thankYou');

    // Filtrar por membro (como envidor ou destinatário)
    if (memberId) {
      queryBuilder.where(
        '(thankYou.fromMemberId = :memberId OR thankYou.toMemberId = :memberId)',
        { memberId },
      );
    }

    queryBuilder
      .leftJoinAndSelect('thankYou.fromMember', 'fromMember')
      .leftJoinAndSelect('thankYou.toMember', 'toMember')
      .leftJoinAndSelect('thankYou.referral', 'referral')
      .orderBy('thankYou.createdAt', 'DESC')
      .skip((page - 1) * size)
      .take(size);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data: data.map((ty) => this.mapToResponseDto(ty)),
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
    };
  }

  async findOne(id: string): Promise<ThankYou> {
    const thankYou = await this.thankYouRepository.findOne({
      where: { id },
      relations: ['fromMember', 'toMember', 'referral'],
    });

    if (!thankYou) {
      throw new NotFoundException('Thank you not found');
    }

    return thankYou;
  }

  async findByMember(memberId: string): Promise<ThankYou[]> {
    return this.thankYouRepository.find({
      where: [{ fromMemberId: memberId }, { toMemberId: memberId }],
      relations: ['fromMember', 'toMember', 'referral'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateThankYouDto: UpdateThankYouDto,
  ): Promise<ThankYou> {
    const thankYou = await this.findOne(id);
    Object.assign(thankYou, updateThankYouDto);
    return this.thankYouRepository.save(thankYou);
  }

  async remove(id: string): Promise<void> {
    const thankYou = await this.findOne(id);
    await this.thankYouRepository.remove(thankYou);
  }

  /**
   * Helper: Mapear entidade para DTO
   */
  private mapToResponseDto(thankYou: ThankYou): ThankYouResponseDto {
    const dto = new ThankYouResponseDto();
    dto.id = thankYou.id;
    dto.fromMemberId = thankYou.fromMemberId;
    dto.fromMember = thankYou.fromMember;
    dto.toMemberId = thankYou.toMemberId;
    dto.toMember = thankYou.toMember;
    dto.description = thankYou.description;
    dto.amount = thankYou.amount;
    dto.referralId = thankYou.referralId;
    dto.referral = thankYou.referral;
    dto.createdAt = thankYou.createdAt;
    return dto;
  }
}
