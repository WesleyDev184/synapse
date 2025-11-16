import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UsersService } from '@modules/users/users.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { CreateInviteDto } from './dto/create-invite.dto';
import {
  InviteResponseDto,
  PaginatedInvitesResponseDto,
} from './dto/response-invite.dto';
import { Invite, InviteStatus } from './entities/invite.entity';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>,
    private readonly userService: UsersService,
  ) {}

  async create(createInviteDto: CreateInviteDto): Promise<Invite> {
    const existingInvite = await this.inviteRepository
      .createQueryBuilder('invite')
      .select(['invite.id', 'invite.status'])
      .where('invite.email = :email', { email: createInviteDto.email })
      .andWhere('invite.status = :status', { status: InviteStatus.PENDING })
      .getOne();

    if (existingInvite) {
      throw new BadRequestException('Invite already exists for this email');
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invite = this.inviteRepository.create({
      ...createInviteDto,
      token,
      expiresAt,
    });

    return this.inviteRepository.save(invite);
  }

  async findAll(
    page: number = 1,
    size: number = 10,
    status?: InviteStatus,
    email?: string,
  ): Promise<PaginatedInvitesResponseDto> {
    const offset = (page - 1) * size;

    // Count query (aplica filtros, sem paginação)
    const countQb = this.inviteRepository.createQueryBuilder('invite');

    if (status) {
      countQb.where('invite.status = :status', { status });
    }

    if (email) {
      // se where não foi chamado antes, andWhere ainda funciona no QueryBuilder
      countQb.andWhere('invite.email ILIKE :email', { email: `%${email}%` });
    }

    const total = await countQb.getCount();

    if (total === 0) {
      return {
        data: [],
        page,
        size,
        total: 0,
        totalPages: 0,
      };
    }

    // Buscar ids ordenados para paginação estável
    const idsQb = this.inviteRepository.createQueryBuilder('invite');

    if (status) {
      idsQb.where('invite.status = :status', { status });
    }

    if (email) {
      idsQb.andWhere('invite.email ILIKE :email', { email: `%${email}%` });
    }

    const rawIds = await idsQb
      .select('invite.id', 'id')
      .orderBy('invite.createdAt', 'DESC')
      .addOrderBy('invite.id', 'ASC')
      .skip(offset)
      .take(size)
      .getRawMany();

    const ids = rawIds.map((r) => r.id) as string[];

    if (ids.length === 0) {
      return {
        data: [],
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
      };
    }

    // Buscar entidades completas (com relacionamento) apenas para os ids da página
    const entities = await this.inviteRepository
      .createQueryBuilder('invite')
      .leftJoinAndSelect('invite.application', 'application')
      .where('invite.id IN (:...ids)', { ids })
      .getMany();

    const entitiesById = new Map(entities.map((e) => [e.id, e]));
    const ordered = ids
      .map((id) => entitiesById.get(id))
      .filter(Boolean) as Invite[];

    return {
      data: ordered.map((inv) => this.mapToResponseDto(inv)),
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
    };
  }

  async findByToken(token: string): Promise<Invite> {
    const invite = await this.inviteRepository.findOne({
      where: { token },
      relations: ['application'],
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('Invite already used');
    }

    if (new Date() > invite.expiresAt) {
      throw new BadRequestException('Invite expired');
    }

    return invite;
  }

  async remove(id: string): Promise<void> {
    const invite = await this.inviteRepository.findOne({ where: { id } });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }
    await this.inviteRepository.remove(invite);
  }

  async completeInvite(
    token: string,
    userData: CreateUserDto,
  ): Promise<Invite> {
    const invite = await this.findByToken(token);
    invite.status = InviteStatus.COMPLETED;
    const res = await this.inviteRepository.save(invite);
    await this.userService.create(userData);
    return res;
  }

  /**
   * Helper: Mapear entidade para DTO
   */
  private mapToResponseDto(invite: Invite): InviteResponseDto {
    const dto = new InviteResponseDto();
    dto.id = invite.id;
    dto.email = invite.email;
    dto.token = invite.token;
    dto.expiresAt = invite.expiresAt;
    dto.status = invite.status;
    dto.applicationId = invite.applicationId;
    dto.application = invite.application;
    dto.createdAt = invite.createdAt;
    return dto;
  }
}
