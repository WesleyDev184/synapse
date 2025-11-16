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
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Announcement } from './entities/announcement.entity';

@ApiTags('Announcements')
@Controller('announcements')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo anúncio',
    description:
      'Cria um novo anúncio que será visível para todos os usuários.',
  })
  @ApiBody({
    type: CreateAnnouncementDto,
    description: 'Dados do novo anúncio',
    examples: {
      announcement: {
        value: {
          title: 'Manutenção do sistema',
          content:
            'O sistema estará em manutenção no próximo sábado das 00h às 02h.',
          priority: 'high',
        },
        description: 'Exemplo de anúncio prioritário',
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Anúncio criado com sucesso',
    type: Announcement,
  })
  @ApiBadRequestResponse({
    description: 'Dados do anúncio inválidos',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @CurrentUser() user: User,
  ): Promise<Announcement> {
    return this.announcementsService.create(createAnnouncementDto, user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar todos os anúncios',
    description:
      'Retorna uma lista paginada de todos os anúncios cadastrados, ordenados por data de criação.',
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
    description: 'Buscar por título ou conteúdo',
  })
  @ApiQuery({
    name: 'authorId',
    required: false,
    type: String,
    description: 'Filtrar por autor (UUID)',
  })
  @ApiOkResponse({
    description: 'Lista de anúncios retornada com sucesso',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('search') search?: string,
    @Query('authorId') authorId?: string,
  ) {
    return this.announcementsService.findAll(page, size, search, authorId);
  }

  @Get('author/:authorId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar anúncios por autor',
    description: 'Retorna todos os anúncios criados por um autor específico.',
  })
  @ApiParam({
    name: 'authorId',
    required: true,
    type: String,
    description: 'UUID do autor',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Lista de anúncios do autor retornada com sucesso',
    type: [Announcement],
  })
  @ApiNotFoundResponse({
    description: 'Nenhum anúncio encontrado para este autor',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findByAuthor(@Param('authorId') authorId: string): Promise<Announcement[]> {
    return this.announcementsService.findByAuthor(authorId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obter detalhes do anúncio',
    description: 'Retorna os detalhes completos de um anúncio específico.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID do anúncio',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Anúncio encontrado',
    type: Announcement,
  })
  @ApiNotFoundResponse({
    description: 'Anúncio com o ID fornecido não encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findOne(@Param('id') id: string): Promise<Announcement> {
    return this.announcementsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Atualizar anúncio',
    description:
      'Atualiza os dados de um anúncio existente. Apenas os campos fornecidos serão atualizados.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID do anúncio a ser atualizado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateAnnouncementDto,
    description: 'Dados a serem atualizados (todos os campos são opcionais)',
    examples: {
      partial: {
        value: {
          title: 'Novo título do anúncio',
        },
        description: 'Exemplo de atualização do título',
      },
    },
  })
  @ApiOkResponse({
    description: 'Anúncio atualizado com sucesso',
    type: Announcement,
  })
  @ApiBadRequestResponse({
    description: 'Dados fornecidos inválidos',
  })
  @ApiNotFoundResponse({
    description: 'Anúncio com o ID fornecido não encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    return this.announcementsService.update(id, updateAnnouncementDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deletar anúncio',
    description: 'Deleta um anúncio permanentemente do sistema.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID do anúncio a ser deletado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiNoContentResponse({
    description: 'Anúncio deletado com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Anúncio com o ID fornecido não encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.announcementsService.remove(id);
  }
}
