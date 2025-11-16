import { AuthGuard } from '@modules/auth/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMembershipPaymentDto } from './dto/create-membership_payment.dto';
import { UpdateMembershipPaymentDto } from './dto/update-membership_payment.dto';
import {
  MembershipPayment,
  PaymentStatus,
} from './entities/membership_payment.entity';
import { MembershipPaymentsService } from './membership_payments.service';

/**
 * Gerenciamento de Pagamentos de Membros
 * Endpoints para gerenciar pagamentos de membros e assinaturas.
 * Rastreia status de pagamento, datas de vencimento e histórico de transações.
 * Requer autenticação JWT.
 */
@ApiTags('Membership Payments')
@Controller('membership-payments')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class MembershipPaymentsController {
  constructor(
    private readonly membershipPaymentsService: MembershipPaymentsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo pagamento de membros',
    description: 'Registra um novo pagamento de membros no sistema.',
  })
  @ApiBody({
    type: CreateMembershipPaymentDto,
    description: 'Dados do pagamento de membro',
  })
  @ApiCreatedResponse({
    description: 'Pagamento criado com sucesso',
    type: MembershipPayment,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos para o pagamento',
  })
  create(
    @Body() createMembershipPaymentDto: CreateMembershipPaymentDto,
  ): Promise<MembershipPayment> {
    return this.membershipPaymentsService.create(createMembershipPaymentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os pagamentos',
    description:
      'Retorna uma lista paginada de todos os pagamentos de membros registrados.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (padrão: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'size',
    required: false,
    type: Number,
    description: 'Quantidade de itens por página (padrão: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'memberId',
    required: false,
    type: String,
    description: 'Filtrar por ID do membro (UUID)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filtrar por status (PENDING, PAID, OVERDUE)',
    enum: PaymentStatus,
  })
  @ApiOkResponse({
    description: 'Lista de pagamentos retornada com sucesso',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('memberId') memberId?: string,
    @Query('status') status?: PaymentStatus,
  ) {
    return this.membershipPaymentsService.findAll(page, size, memberId, status);
  }

  @Get('member/:memberId')
  @ApiOperation({
    summary: 'Listar pagamentos por membro',
    description:
      'Retorna todos os pagamentos associados a um membro específico.',
  })
  @ApiParam({
    name: 'memberId',
    required: true,
    type: String,
    description: 'UUID do membro',
  })
  @ApiOkResponse({
    description: 'Lista de pagamentos do membro retornada com sucesso',
    type: [MembershipPayment],
  })
  findByMember(
    @Param('memberId') memberId: string,
  ): Promise<MembershipPayment[]> {
    return this.membershipPaymentsService.findByMember(memberId);
  }

  @Get('status/:status')
  @ApiOperation({
    summary: 'Listar pagamentos por status',
    description: 'Retorna todos os pagamentos com um status específico.',
  })
  @ApiParam({
    name: 'status',
    required: true,
    type: String,
    enum: ['pending', 'paid', 'overdue', 'failed'],
    description: 'Status do pagamento',
  })
  @ApiOkResponse({
    description: 'Lista de pagamentos com o status fornecido',
    type: [MembershipPayment],
  })
  findByStatus(
    @Param('status') status: PaymentStatus,
  ): Promise<MembershipPayment[]> {
    return this.membershipPaymentsService.findByStatus(status);
  }

  @Get('overdue/list')
  @ApiOperation({
    summary: 'Listar pagamentos vencidos',
    description: 'Retorna todos os pagamentos que estão vencidos.',
  })
  @ApiOkResponse({
    description: 'Lista de pagamentos vencidos retornada com sucesso',
    type: [MembershipPayment],
  })
  findOverdue(): Promise<MembershipPayment[]> {
    return this.membershipPaymentsService.findOverdue();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter pagamento por ID',
    description: 'Retorna os detalhes completos de um pagamento específico.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID do pagamento',
  })
  @ApiOkResponse({
    description: 'Pagamento encontrado',
    type: MembershipPayment,
  })
  @ApiNotFoundResponse({
    description: 'Pagamento não encontrado',
  })
  findOne(@Param('id') id: string): Promise<MembershipPayment> {
    return this.membershipPaymentsService.findOne(id);
  }

  @Post(':id/mark-as-paid')
  @ApiOperation({
    summary: 'Marcar pagamento como pago',
    description: 'Marca um pagamento como pago e atualiza seu status.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID do pagamento a ser marcado como pago',
  })
  @ApiOkResponse({
    description: 'Pagamento marcado como pago com sucesso',
    type: MembershipPayment,
  })
  @ApiNotFoundResponse({
    description: 'Pagamento não encontrado',
  })
  markAsPaid(@Param('id') id: string): Promise<MembershipPayment> {
    return this.membershipPaymentsService.markAsPaid(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar pagamento',
    description: 'Atualiza os dados de um pagamento existente.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID do pagamento a ser atualizado',
  })
  @ApiBody({
    type: UpdateMembershipPaymentDto,
    description: 'Dados a serem atualizados',
  })
  @ApiOkResponse({
    description: 'Pagamento atualizado com sucesso',
    type: MembershipPayment,
  })
  @ApiNotFoundResponse({
    description: 'Pagamento não encontrado',
  })
  update(
    @Param('id') id: string,
    @Body() updateMembershipPaymentDto: UpdateMembershipPaymentDto,
  ): Promise<MembershipPayment> {
    return this.membershipPaymentsService.update(
      id,
      updateMembershipPaymentDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deletar pagamento',
    description: 'Deleta um pagamento permanentemente do sistema.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID do pagamento a ser deletado',
  })
  @ApiNoContentResponse({
    description: 'Pagamento deletado com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Pagamento não encontrado',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.membershipPaymentsService.remove(id);
  }
}
