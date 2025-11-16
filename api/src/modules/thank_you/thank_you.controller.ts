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
import { CreateThankYouDto } from './dto/create-thank_you.dto';
import { UpdateThankYouDto } from './dto/update-thank_you.dto';
import { ThankYou } from './entities/thank_you.entity';
import { ThankYouService } from './thank_you.service';

/**
 * Gerenciamento de Agradecimentos
 * Endpoints para criar e gerenciar mensagens de agradecimento entre membros.
 * Permite expressar gratidão e reconhecer contribuições.
 * Requer autenticação JWT.
 */
@ApiTags('Thank You')
@Controller('thank-you')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ThankYouController {
  constructor(private readonly thankYouService: ThankYouService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Enviar mensagem de agradecimento',
    description:
      'Cria uma nova mensagem de agradecimento de um membro para outro. O usuário atual será registrado como remetente.',
  })
  @ApiBody({
    type: CreateThankYouDto,
    description: 'Dados da mensagem de agradecimento',
    examples: {
      thankYou: {
        value: {
          recipientId: '550e8400-e29b-41d4-a716-446655440001',
          message: 'Obrigado por sua ajuda e apoio!',
          category: 'mentoring',
        },
        description: 'Exemplo de agradecimento por mentoria',
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Mensagem de agradecimento enviada com sucesso',
    type: ThankYou,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos para a mensagem de agradecimento',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  create(
    @Body() createThankYouDto: CreateThankYouDto,
    @CurrentUser() user: User,
  ): Promise<ThankYou> {
    return this.thankYouService.create(createThankYouDto, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar mensagens de agradecimento',
    description:
      'Retorna uma lista paginada de todas as mensagens de agradecimento.',
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
    description: 'Filtrar por ID do membro (como remetente ou destinatário)',
  })
  @ApiOkResponse({
    description: 'Lista de agradecimentos retornada com sucesso',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('memberId') memberId?: string,
  ) {
    return this.thankYouService.findAll(page, size, memberId);
  }

  @Get('member/:memberId')
  @ApiOperation({
    summary: 'Listar agradecimentos para um membro',
    description:
      'Retorna todas as mensagens de agradecimento recebidas por um membro específico.',
  })
  @ApiParam({
    name: 'memberId',
    required: true,
    type: String,
    description: 'UUID do membro destinatário',
  })
  @ApiOkResponse({
    description: 'Lista de agradecimentos do membro retornada com sucesso',
    type: [ThankYou],
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findByMember(@Param('memberId') memberId: string): Promise<ThankYou[]> {
    return this.thankYouService.findByMember(memberId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter detalhes do agradecimento',
    description:
      'Retorna os detalhes completos de uma mensagem de agradecimento específica.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da mensagem de agradecimento',
  })
  @ApiOkResponse({
    description: 'Mensagem de agradecimento encontrada',
    type: ThankYou,
  })
  @ApiNotFoundResponse({
    description: 'Mensagem de agradecimento não encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findOne(@Param('id') id: string): Promise<ThankYou> {
    return this.thankYouService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar mensagem de agradecimento',
    description:
      'Atualiza os dados de uma mensagem de agradecimento existente.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da mensagem de agradecimento a ser atualizada',
  })
  @ApiBody({
    type: UpdateThankYouDto,
    description: 'Dados a serem atualizados',
  })
  @ApiOkResponse({
    description: 'Mensagem de agradecimento atualizada com sucesso',
    type: ThankYou,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiNotFoundResponse({
    description: 'Mensagem de agradecimento não encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  update(
    @Param('id') id: string,
    @Body() updateThankYouDto: UpdateThankYouDto,
  ): Promise<ThankYou> {
    return this.thankYouService.update(id, updateThankYouDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deletar agradecimento',
    description:
      'Deleta uma mensagem de agradecimento permanentemente do sistema.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da mensagem de agradecimento a ser deletada',
  })
  @ApiNoContentResponse({
    description: 'Mensagem de agradecimento deletada com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Mensagem de agradecimento não encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.thankYouService.remove(id);
  }
}
