import { InvitesService } from '@modules/invites/invites.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplicationDto } from './dto/create-application.dto';
import {
  ApplicationResponseDto,
  PaginatedApplicationsResponseDto,
} from './dto/response-application.dto';
import { Application, ApplicationStatus } from './entities/application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly inviteService: InvitesService,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    // Verificar se o email já existe
    const existingApplication = await this.applicationRepository.findOne({
      select: ['id'],
      where: { email: createApplicationDto.email },
    });

    if (existingApplication) {
      throw new BadRequestException('Email already registered');
    }

    const application = this.applicationRepository.create({
      company: createApplicationDto.company,
      email: createApplicationDto.email,
      name: createApplicationDto.name,
      reason: createApplicationDto.reason,
    });

    return this.applicationRepository.save(application);
  }

  async findAll(
    page: number = 1,
    size: number = 10,
    search?: string,
    status?: ApplicationStatus,
  ): Promise<PaginatedApplicationsResponseDto> {
    const offset = (page - 1) * size;

    const countQb =
      this.applicationRepository.createQueryBuilder('application');

    if (search) {
      countQb.where(
        'application.name ILIKE :search OR application.email ILIKE :search OR application.company ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (status) {
      countQb.andWhere('application.status = :status', { status });
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

    const idsQb = this.applicationRepository.createQueryBuilder('application');

    if (search) {
      idsQb.where(
        'application.name ILIKE :search OR application.email ILIKE :search OR application.company ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (status) {
      idsQb.andWhere('application.status = :status', { status });
    }

    const rawIds = await idsQb
      .select('application.id', 'id')
      .orderBy('application.createdAt', 'DESC')
      .addOrderBy('application.id', 'ASC')
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

    const entities = await this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.reviewedBy', 'reviewedBy')
      .where('application.id IN (:...ids)', { ids })
      .getMany();

    const entitiesById = new Map(entities.map((e) => [e.id, e]));
    const ordered = ids.map((id) => entitiesById.get(id)).filter(Boolean) as
      | Application[]
      | Application[];

    return {
      data: ordered.map((app) => this.mapToResponseDto(app)),
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
    };
  }

  async findByStatus(status: ApplicationStatus): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { status },
      relations: ['reviewedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async approveApplication(
    id: string,
    reviewedById: string,
  ): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      select: ['id', 'status', 'reviewedById', 'email'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException(
        'Only pending applications can be approved',
      );
    }

    application.status = ApplicationStatus.APPROVED;
    application.reviewedById = reviewedById;
    const res = await this.applicationRepository.save(application);

    await this.inviteService.create({
      applicationId: application.id,
      email: application.email,
    });

    return res;
  }

  async rejectApplication(
    id: string,
    reviewedById: string,
  ): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      select: ['id', 'status', 'reviewedById'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException(
        'Only pending applications can be rejected',
      );
    }

    application.status = ApplicationStatus.REJECTED;
    application.reviewedById = reviewedById;

    return this.applicationRepository.save(application);
  }

  /**
   * Helper: Mapear entidade para DTO
   */
  private mapToResponseDto(application: Application): ApplicationResponseDto {
    const dto = new ApplicationResponseDto();
    dto.id = application.id;
    dto.name = application.name;
    dto.email = application.email;
    dto.company = application.company;
    dto.reason = application.reason;
    dto.status = application.status;
    dto.reviewedById = application.reviewedById;
    dto.createdAt = application.createdAt;
    return dto;
  }
}
