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
import { CreateOneOnOneMeetingDto } from './dto/create-one_on_one_meeting.dto';
import { UpdateOneOnOneMeetingDto } from './dto/update-one_on_one_meeting.dto';
import { OneOnOneMeeting } from './entities/one_on_one_meeting.entity';
import { OneOnOneMeetingService } from './one_on_one_meeting.service';

/**
 * Gerenciamento de Reuniões 1:1
 * Endpoints para agendar, gerenciar e rastrear reuniões individuais entre membros.
 * Requer autenticação JWT.
 */
@ApiTags('One-on-One Meetings')
@Controller('one-on-one-meetings')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class OneOnOneMeetingController {
  constructor(
    private readonly oneOnOneMeetingService: OneOnOneMeetingService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Agendar nova reunião 1:1',
    description:
      'Cria um novo agendamento de reunião individual. O usuário atual será registrado como organizador.',
  })
  @ApiBody({
    type: CreateOneOnOneMeetingDto,
    description: 'Dados da reunião 1:1',
  })
  @ApiCreatedResponse({
    description: 'Reunião 1:1 agendada com sucesso',
    type: OneOnOneMeeting,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos para a reunião',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  create(
    @Body() createOneOnOneMeetingDto: CreateOneOnOneMeetingDto,
    @CurrentUser() user: User,
  ): Promise<OneOnOneMeeting> {
    return this.oneOnOneMeetingService.create(
      createOneOnOneMeetingDto,
      user.id,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as reuniões 1:1',
    description:
      'Retorna uma lista paginada de todas as reuniões 1:1 cadastradas.',
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
    description: 'Filtrar por ID do membro',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    type: String,
    format: 'date-time',
    description: 'Data inicial para filtro (ISO 8601)',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    type: String,
    format: 'date-time',
    description: 'Data final para filtro (ISO 8601)',
  })
  @ApiOkResponse({
    description: 'Lista de reuniões 1:1 retornada com sucesso',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('memberId') memberId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.oneOnOneMeetingService.findAll(
      page,
      size,
      memberId,
      dateFrom,
      dateTo,
    );
  }

  @Get('member/:memberId')
  @ApiOperation({
    summary: 'Listar reuniões 1:1 por membro',
    description:
      'Retorna todas as reuniões 1:1 associadas a um membro específico.',
  })
  @ApiParam({
    name: 'memberId',
    required: true,
    type: String,
    description: 'UUID do membro',
  })
  @ApiOkResponse({
    description: 'Lista de reuniões 1:1 do membro retornada com sucesso',
    type: [OneOnOneMeeting],
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findByMember(
    @Param('memberId') memberId: string,
  ): Promise<OneOnOneMeeting[]> {
    return this.oneOnOneMeetingService.findByMember(memberId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter detalhes da reunião 1:1',
    description: 'Retorna os detalhes completos de uma reunião 1:1 específica.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da reunião 1:1',
  })
  @ApiOkResponse({
    description: 'Reunião 1:1 encontrada',
    type: OneOnOneMeeting,
  })
  @ApiNotFoundResponse({
    description: 'Reunião 1:1 não encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findOne(@Param('id') id: string): Promise<OneOnOneMeeting> {
    return this.oneOnOneMeetingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar reunião 1:1',
    description: 'Atualiza os dados de uma reunião 1:1 existente.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da reunião 1:1 a ser atualizada',
  })
  @ApiBody({
    type: UpdateOneOnOneMeetingDto,
    description: 'Dados a serem atualizados',
  })
  @ApiOkResponse({
    description: 'Reunião 1:1 atualizada com sucesso',
    type: OneOnOneMeeting,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiNotFoundResponse({
    description: 'Reunião 1:1 não encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  update(
    @Param('id') id: string,
    @Body() updateOneOnOneMeetingDto: UpdateOneOnOneMeetingDto,
  ): Promise<OneOnOneMeeting> {
    return this.oneOnOneMeetingService.update(id, updateOneOnOneMeetingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Cancelar reunião 1:1',
    description: 'Cancela e deleta uma reunião 1:1 permanentemente do sistema.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da reunião 1:1 a ser cancelada',
  })
  @ApiNoContentResponse({
    description: 'Reunião 1:1 cancelada com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Reunião 1:1 não encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.oneOnOneMeetingService.remove(id);
  }
}
