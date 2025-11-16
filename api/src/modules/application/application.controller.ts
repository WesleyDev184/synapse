import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { RequireAuth } from '@shared/decorators/require-auth.decorator';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationStatus } from './entities/application.entity';

/**
 * Gerenciamento de Aplicações
 * Endpoints para processar aplicações de novos usuários.
 * Permite criação, aprovação, rejeição e gerenciamento de candidaturas.
 */
@ApiTags('Applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar nova aplicação',
    description: 'Cria uma nova aplicação/candidatura no sistema.',
  })
  @ApiBody({
    type: CreateApplicationDto,
    description: 'Dados da aplicação',
  })
  @ApiCreatedResponse({
    description: 'Aplicação criada com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos na aplicação',
  })
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationService.create(createApplicationDto);
  }

  @Get()
  @RequireAuth()
  @ApiOperation({
    summary: 'Listar todas as aplicações',
    description:
      'Retorna uma lista paginada de todas as aplicações cadastradas.',
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
    description: 'Buscar por nome, email ou empresa',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filtrar por status (PENDING, APPROVED, REJECTED)',
    enum: ApplicationStatus,
  })
  @ApiOkResponse({
    description: 'Lista de aplicações retornada com sucesso',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: ApplicationStatus,
  ) {
    return this.applicationService.findAll(page, size, search, status);
  }

  @Patch(':id/approve')
  @RequireAuth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Aprovar aplicação',
    description:
      'Aprova uma aplicação/candidatura. O usuário atual será registrado como aprovador.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da aplicação a ser aprovada',
  })
  @ApiOkResponse({
    description: 'Aplicação aprovada com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Aplicação não encontrada',
  })
  approve(@Param('id') id: string, @CurrentUser() user: any) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can approve applications');
    }

    return this.applicationService.approveApplication(id, user.id);
  }

  @Patch(':id/reject')
  @RequireAuth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Rejeitar aplicação',
    description:
      'Rejeita uma aplicação/candidatura. O usuário atual será registrado como responsável pela rejeição.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da aplicação a ser rejeitada',
  })
  @ApiOkResponse({
    description: 'Aplicação rejeitada com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Aplicação não encontrada',
  })
  reject(@Param('id') id: string, @CurrentUser() user: any) {
    return this.applicationService.rejectApplication(id, user.id);
  }
}
