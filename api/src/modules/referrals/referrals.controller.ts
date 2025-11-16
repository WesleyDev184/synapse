import { AuthGuard } from '@modules/auth/auth.guard';
import { User } from '@modules/users/entities/user.entity';
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
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';
import { Referral, ReferralStatus } from './entities/referral.entity';
import { ReferralsService } from './referrals.service';

/**
 * Gerenciamento de Indicações/Referrals
 * Endpoints para gerenciar indicações de membros no sistema.
 * Rastreia referências, status e histórico de indicações.
 * Requer autenticação JWT.
 */
@ApiTags('Referrals')
@Controller('referrals')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar nova indicação',
    description:
      'Cria uma nova indicação de membro no sistema. O usuário atual será registrado como referenciador.',
  })
  @ApiBody({
    type: CreateReferralDto,
    description: 'Dados da indicação',
  })
  @ApiCreatedResponse({
    description: 'Indicação criada com sucesso',
    type: Referral,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos para a indicação',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  create(
    @Body() createReferralDto: CreateReferralDto,
    @CurrentUser() user: User,
  ): Promise<Referral> {
    return this.referralsService.create(createReferralDto, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as indicações',
    description:
      'Retorna uma lista paginada de todas as indicações cadastradas no sistema.',
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
    description:
      'Filtrar por ID do membro (como referenciador ou referenciado)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filtrar por status (SENT, NEGOTIATING, CLOSED, REJECTED)',
    enum: ReferralStatus,
  })
  @ApiOkResponse({
    description: 'Lista de indicações retornada com sucesso',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('memberId') memberId?: string,
    @Query('status') status?: ReferralStatus,
  ) {
    return this.referralsService.findAll(page, size, memberId, status);
  }

  @Get('member/:memberId')
  @ApiOperation({
    summary: 'Listar indicações por membro',
    description:
      'Retorna todas as indicações associadas a um membro específico.',
  })
  @ApiParam({
    name: 'memberId',
    required: true,
    type: String,
    description: 'UUID do membro',
  })
  @ApiOkResponse({
    description: 'Lista de indicações do membro retornada com sucesso',
    type: [Referral],
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findByMember(@Param('memberId') memberId: string): Promise<Referral[]> {
    return this.referralsService.findByMember(memberId);
  }

  @Get('status/:status')
  @ApiOperation({
    summary: 'Listar indicações por status',
    description: 'Retorna todas as indicações com um status específico.',
  })
  @ApiParam({
    name: 'status',
    required: true,
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    description: 'Status da indicação',
  })
  @ApiOkResponse({
    description: 'Lista de indicações com o status fornecido',
    type: [Referral],
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findByStatus(@Param('status') status: ReferralStatus): Promise<Referral[]> {
    return this.referralsService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter indicação por ID',
    description: 'Retorna os detalhes completos de uma indicação específica.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da indicação',
  })
  @ApiOkResponse({
    description: 'Indicação encontrada',
    type: Referral,
  })
  @ApiNotFoundResponse({
    description: 'Indicação não encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findOne(@Param('id') id: string): Promise<Referral> {
    return this.referralsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar indicação',
    description: 'Atualiza os dados de uma indicação existente.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da indicação',
  })
  @ApiBody({
    type: UpdateReferralDto,
    description: 'Dados a serem atualizados',
  })
  @ApiOkResponse({
    description: 'Indicação atualizada com sucesso',
    type: Referral,
  })
  @ApiNotFoundResponse({
    description: 'Indicação não encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  update(
    @Param('id') id: string,
    @Body() updateReferralDto: UpdateReferralDto,
  ): Promise<Referral> {
    return this.referralsService.update(id, updateReferralDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deletar indicação',
    description: 'Deleta uma indicação permanentemente do sistema.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da indicação',
  })
  @ApiNoContentResponse({
    description: 'Indicação deletada com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Indicação não encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.referralsService.remove(id);
  }
}
