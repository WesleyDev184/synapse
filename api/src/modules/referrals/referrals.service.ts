import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReferralDto } from './dto/create-referral.dto';
import {
  PaginatedReferralsResponseDto,
  ReferralResponseDto,
} from './dto/response-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';
import { Referral, ReferralStatus } from './entities/referral.entity';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectRepository(Referral)
    private readonly referralRepository: Repository<Referral>,
  ) {}

  async create(
    createReferralDto: CreateReferralDto,
    fromMemberId: string,
  ): Promise<Referral> {
    const referral = this.referralRepository.create({
      ...createReferralDto,
      fromMemberId,
    });

    return this.referralRepository.save(referral);
  }

  async findAll(
    page: number = 1,
    size: number = 10,
    memberId?: string,
    status?: ReferralStatus,
  ): Promise<PaginatedReferralsResponseDto> {
    const queryBuilder = this.referralRepository.createQueryBuilder('referral');

    // Filtrar por membro (como referenciador ou referenciado)
    if (memberId) {
      queryBuilder.where(
        '(referral.fromMemberId = :memberId OR referral.toMemberId = :memberId)',
        { memberId },
      );
    }

    // Filtrar por status
    if (status) {
      queryBuilder.andWhere('referral.status = :status', { status });
    }

    queryBuilder
      .leftJoinAndSelect('referral.fromMember', 'fromMember')
      .leftJoinAndSelect('referral.toMember', 'toMember')
      .orderBy('referral.createdAt', 'DESC')
      .skip((page - 1) * size)
      .take(size);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data: data.map((referral) => this.mapToResponseDto(referral)),
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
    };
  }

  async findOne(id: string): Promise<Referral> {
    const referral = await this.referralRepository.findOne({
      where: { id },
      relations: ['fromMember', 'toMember'],
    });

    if (!referral) {
      throw new NotFoundException('Referral not found');
    }

    return referral;
  }

  async findByMember(memberId: string): Promise<Referral[]> {
    return this.referralRepository.find({
      where: [{ fromMemberId: memberId }, { toMemberId: memberId }],
      relations: ['fromMember', 'toMember'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: ReferralStatus): Promise<Referral[]> {
    return this.referralRepository.find({
      where: { status },
      relations: ['fromMember', 'toMember'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateReferralDto: UpdateReferralDto,
  ): Promise<Referral> {
    const referral = await this.findOne(id);
    Object.assign(referral, updateReferralDto);
    return this.referralRepository.save(referral);
  }

  async remove(id: string): Promise<void> {
    const referral = await this.findOne(id);
    await this.referralRepository.remove(referral);
  }

  /**
   * Helper: Mapear entidade para DTO
   */
  private mapToResponseDto(referral: Referral): ReferralResponseDto {
    const dto = new ReferralResponseDto();
    dto.id = referral.id;
    dto.fromMemberId = referral.fromMemberId;
    dto.fromMember = referral.fromMember;
    dto.toMemberId = referral.toMemberId;
    dto.toMember = referral.toMember;
    dto.contactName = referral.contactName;
    dto.contactEmail = referral.contactEmail;
    dto.company = referral.company;
    dto.description = referral.description;
    dto.status = referral.status;
    dto.createdAt = referral.createdAt;
    dto.updatedAt = referral.updatedAt;
    return dto;
  }
}
