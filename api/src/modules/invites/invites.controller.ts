import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RequireAuth } from '@shared/decorators/require-auth.decorator';
import { Invite, InviteStatus } from './entities/invite.entity';
import { InvitesService } from './invites.service';

/**
 * Gerenciamento de Convites
 * Endpoints para criar, gerenciar e controlar convites para usuários do sistema.
 * Permite enviar, aceitar e revogar convites.
 */
@ApiTags('Invites')
@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Get()
  @RequireAuth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar convites',
    description: 'Retorna uma lista paginada de todos os convites cadastrados.',
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
    name: 'status',
    required: false,
    type: String,
    description: 'Filtrar por status (PENDING, COMPLETED)',
    enum: InviteStatus,
  })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: 'Buscar por email',
  })
  @ApiOkResponse({
    description: 'Lista de convites retornada com sucesso',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('status') status?: InviteStatus,
    @Query('email') email?: string,
  ) {
    return this.invitesService.findAll(page, size, status, email);
  }

  @Get('token/:token')
  @ApiOperation({
    summary: 'Obter convite por token',
    description:
      'Retorna os detalhes de um convite usando seu token único. Não requer autenticação.',
  })
  @ApiParam({
    name: 'token',
    required: true,
    type: String,
    description: 'Token único do convite',
  })
  @ApiOkResponse({
    description: 'Convite encontrado',
    type: Invite,
  })
  @ApiNotFoundResponse({
    description: 'Convite com token fornecido não encontrado',
  })
  findByToken(@Param('token') token: string): Promise<Invite> {
    return this.invitesService.findByToken(token);
  }

  @Post(':token/complete')
  @ApiBearerAuth()
  @ApiBody({
    description: 'Dados do usuário para completar o convite',
    type: CreateUserDto,
  })
  @ApiOperation({
    summary: 'Completar convite',
    description: 'Marca um convite como completado e finaliza seu processo.',
  })
  @ApiParam({
    name: 'token',
    required: true,
    type: String,
    description: 'token do convite',
  })
  @ApiOkResponse({
    description: 'Convite completado com sucesso',
    type: Invite,
  })
  @ApiNotFoundResponse({
    description: 'Convite não encontrado',
  })
  completeInvite(
    @Param('token') token: string,
    @Body() userData: CreateUserDto,
  ): Promise<Invite> {
    return this.invitesService.completeInvite(token, userData);
  }

  @Delete(':id')
  @RequireAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deletar convite',
    description: 'Deleta um convite permanentemente do sistema.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID do convite',
  })
  @ApiNoContentResponse({
    description: 'Convite deletado com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Convite não encontrado',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.invitesService.remove(id);
  }
}
