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
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { MeetingAttendance } from './entities/meeting-attendance.entity';
import { Meeting } from './entities/meeting.entity';
import { MeetingsService } from './meetings.service';

/**
 * Gerenciamento de Reuniões
 * Endpoints para criar, listar, atualizar e deletar reuniões.
 * Gerencia participantes, presença e detalhes de reuniões.
 * Requer autenticação JWT.
 */
@ApiTags('Meetings')
@Controller('meetings')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar nova reunião',
    description:
      'Cria uma nova reunião com informações de título, descrição e horário.',
  })
  @ApiBody({
    type: CreateMeetingDto,
    description: 'Dados da nova reunião',
    examples: {
      meeting: {
        value: {
          title: 'Reunião com o time de design',
          description: 'Discussão sobre novos layouts',
          startTime: '2024-11-15T14:00:00Z',
          endTime: '2024-11-15T15:00:00Z',
          location: 'Sala de Conferência A',
        },
        description: 'Exemplo de criação de reunião',
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Reunião criada com sucesso',
    type: Meeting,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou horário inconsistente',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  create(@Body() createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    return this.meetingsService.create(createMeetingDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar todas as reuniões',
    description:
      'Retorna uma lista paginada de todas as reuniões cadastradas no sistema.',
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
    name: 'search',
    required: false,
    type: String,
    description: 'Buscar por título da reunião',
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
    description: 'Lista de reuniões retornada com sucesso',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('search') search?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.meetingsService.findAll(page, size, search, dateFrom, dateTo);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obter detalhes da reunião',
    description: 'Retorna os detalhes completos de uma reunião específica.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da reunião',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Reunião encontrada',
    type: Meeting,
  })
  @ApiNotFoundResponse({
    description: 'Reunião com o ID fornecido não encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findOne(@Param('id') id: string): Promise<Meeting> {
    return this.meetingsService.findOne(id);
  }

  @Get(':id/attendees')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar participantes da reunião',
    description:
      'Retorna a lista de todos os participantes registrados para uma reunião.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da reunião',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Lista de participantes retornada com sucesso',
    type: [MeetingAttendance],
  })
  @ApiNotFoundResponse({
    description: 'Reunião com o ID fornecido não encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  getMeetingAttendees(
    @Param('id') meetingId: string,
  ): Promise<MeetingAttendance[]> {
    return this.meetingsService.getMeetingAttendees(meetingId);
  }

  @Post(':id/attendance')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar presença na reunião',
    description:
      'Registra o usuário atual como participante (presente) na reunião. Usa o usuário autenticado automaticamente.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da reunião',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiCreatedResponse({
    description: 'Presença registrada com sucesso',
    type: MeetingAttendance,
  })
  @ApiBadRequestResponse({
    description: 'Usuário já está registrado como participante da reunião',
  })
  @ApiNotFoundResponse({
    description: 'Reunião com o ID fornecido não encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  addAttendance(
    @Param('id') meetingId: string,
    @CurrentUser() user: User,
  ): Promise<MeetingAttendance> {
    return this.meetingsService.addAttendance(meetingId, user.id);
  }

  @Delete(':id/attendance/:attendanceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover presença na reunião',
    description: 'Remove o registro de presença de um participante da reunião.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da reunião',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'attendanceId',
    required: true,
    type: String,
    description: 'UUID do registro de presença',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiNoContentResponse({
    description: 'Presença removida com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Reunião ou registro de presença não encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  removeAttendance(@Param('attendanceId') attendanceId: string): Promise<void> {
    return this.meetingsService.removeAttendance(attendanceId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Atualizar informações da reunião',
    description:
      'Atualiza os dados de uma reunião existente. Apenas os campos fornecidos serão atualizados.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da reunião a ser atualizada',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateMeetingDto,
    description: 'Dados a serem atualizados (todos os campos são opcionais)',
  })
  @ApiOkResponse({
    description: 'Reunião atualizada com sucesso',
    type: Meeting,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou horário inconsistente',
  })
  @ApiNotFoundResponse({
    description: 'Reunião com o ID fornecido não encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  update(
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
  ): Promise<Meeting> {
    return this.meetingsService.update(id, updateMeetingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deletar reunião',
    description: 'Deleta uma reunião e todos os seus registros de presença.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da reunião a ser deletada',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiNoContentResponse({
    description: 'Reunião deletada com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Reunião com o ID fornecido não encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.meetingsService.remove(id);
  }
}
