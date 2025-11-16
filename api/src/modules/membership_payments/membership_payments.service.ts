import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { CreateMembershipPaymentDto } from './dto/create-membership_payment.dto';
import {
  MembershipPaymentResponseDto,
  PaginatedMembershipPaymentsResponseDto,
} from './dto/response-membership_payment.dto';
import { UpdateMembershipPaymentDto } from './dto/update-membership_payment.dto';
import {
  MembershipPayment,
  PaymentStatus,
} from './entities/membership_payment.entity';

@Injectable()
export class MembershipPaymentsService {
  constructor(
    @InjectRepository(MembershipPayment)
    private readonly paymentRepository: Repository<MembershipPayment>,
  ) {}

  async create(
    createMembershipPaymentDto: CreateMembershipPaymentDto,
  ): Promise<MembershipPayment> {
    const payment = this.paymentRepository.create({
      ...createMembershipPaymentDto,
      dueDate: new Date(createMembershipPaymentDto.dueDate),
    });

    return this.paymentRepository.save(payment);
  }

  async findAll(
    page: number = 1,
    size: number = 10,
    memberId?: string,
    status?: PaymentStatus,
  ): Promise<PaginatedMembershipPaymentsResponseDto> {
    const queryBuilder = this.paymentRepository.createQueryBuilder('payment');

    // Filtrar por membro
    if (memberId) {
      queryBuilder.where('payment.memberId = :memberId', { memberId });
    }

    // Filtrar por status
    if (status) {
      queryBuilder.andWhere('payment.status = :status', { status });
    }

    queryBuilder
      .leftJoinAndSelect('payment.member', 'member')
      .orderBy('payment.dueDate', 'ASC')
      .skip((page - 1) * size)
      .take(size);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data: data.map((payment) => this.mapToResponseDto(payment)),
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
    };
  }

  async findOne(id: string): Promise<MembershipPayment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['member'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async findByMember(memberId: string): Promise<MembershipPayment[]> {
    return this.paymentRepository.find({
      where: { memberId },
      relations: ['member'],
      order: { dueDate: 'DESC' },
    });
  }

  async findByStatus(status: PaymentStatus): Promise<MembershipPayment[]> {
    return this.paymentRepository.find({
      where: { status },
      relations: ['member'],
      order: { dueDate: 'ASC' },
    });
  }

  async findOverdue(): Promise<MembershipPayment[]> {
    const now = new Date();
    return this.paymentRepository.find({
      where: [
        { status: PaymentStatus.PENDING, dueDate: LessThan(now) },
        { status: PaymentStatus.OVERDUE },
      ],
      relations: ['member'],
      order: { dueDate: 'ASC' },
    });
  }

  async update(
    id: string,
    updateMembershipPaymentDto: UpdateMembershipPaymentDto,
  ): Promise<MembershipPayment> {
    const payment = await this.findOne(id);
    Object.assign(payment, updateMembershipPaymentDto);
    return this.paymentRepository.save(payment);
  }

  async markAsPaid(id: string): Promise<MembershipPayment> {
    const payment = await this.findOne(id);
    payment.status = PaymentStatus.PAID;
    payment.paidAt = new Date();
    return this.paymentRepository.save(payment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepository.remove(payment);
  }

  /**
   * Helper: Mapear entidade para DTO
   */
  private mapToResponseDto(
    payment: MembershipPayment,
  ): MembershipPaymentResponseDto {
    const dto = new MembershipPaymentResponseDto();
    dto.id = payment.id;
    dto.memberId = payment.memberId;
    dto.member = payment.member;
    dto.dueDate = payment.dueDate;
    dto.paidAt = payment.paidAt;
    dto.amount = payment.amount;
    dto.status = payment.status;
    dto.createdAt = payment.createdAt;
    return dto;
  }
}
