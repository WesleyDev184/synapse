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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import {
  CreateUserResponseDto,
  DeleteUserResponseDto,
  PaginatedUsersResponseDto,
  ResponseUserDto,
  UpdateUserResponseDto,
  UserEmailsResponseDto,
} from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

/**
 * Gerenciamento de Usuários
 * Endpoints para criar, listar, atualizar e deletar usuários do sistema.
 * Requer autenticação JWT para a maioria das operações.
 */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo usuário',
    description:
      'Cria um novo registro de usuário com os dados fornecidos. A senha deve conter pelo menos uma letra maiúscula, minúscula, número e caractere especial.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Dados do novo usuário (nome, email, senha obrigatórios)',
    examples: {
      user: {
        value: {
          name: 'João Silva',
          email: 'joao@example.com',
          password: 'SenhaForte@123',
          company: 'Tech Company',
        },
        description: 'Exemplo de criação de usuário com empresa',
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso',
    type: CreateUserResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Validação falhou: nome, email ou senha inválidos. Senha deve conter maiúscula, minúscula, número e caractere especial.',
  })
  @ApiConflictResponse({
    description: 'Email já está registrado no sistema',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  create(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar usuários com paginação',
    description:
      'Retorna uma lista paginada de usuários com opção de busca por nome ou email. Requer autenticação.',
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
    description: 'Quantidade de usuários por página (padrão: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Buscar por nome ou email do usuário',
    example: 'joao',
  })
  @ApiOkResponse({
    description: 'Lista de usuários retornada com sucesso',
    type: PaginatedUsersResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Parâmetros de paginação inválidos',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findAll(
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('search') search?: string,
  ): Promise<PaginatedUsersResponseDto> {
    return this.usersService.findAll(Number(page), Number(size), search);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter usuário por ID',
    description:
      'Retorna os detalhes completos de um usuário específico. Requer autenticação.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID do usuário',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Usuário encontrado e retornado com sucesso',
    type: ResponseUserDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuário com o ID fornecido não encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  findOne(@Param('id') id: string): Promise<ResponseUserDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados do usuário',
    description:
      'Atualiza os dados de um usuário existente. Apenas os campos fornecidos serão atualizados. Requer autenticação.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID do usuário a ser atualizado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Dados a serem atualizados (todos os campos são opcionais)',
    examples: {
      partial: {
        value: {
          name: 'Novo Nome',
          company: 'Nova Empresa',
        },
        description: 'Exemplo de atualização parcial',
      },
    },
  })
  @ApiOkResponse({
    description: 'Usuário atualizado com sucesso',
    type: UpdateUserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados fornecidos inválidos ou formato incorreto',
  })
  @ApiNotFoundResponse({
    description: 'Usuário com o ID fornecido não encontrado',
  })
  @ApiConflictResponse({
    description: 'Email fornecido já está registrado para outro usuário',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deletar usuário',
    description:
      'Deleta um usuário realizando um soft delete. O usuário é marcado como deletado mas os dados são preservados no banco de dados. Requer autenticação.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID do usuário a ser deletado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Usuário deletado com sucesso',
    type: DeleteUserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuário com o ID fornecido não encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
  })
  remove(@Param('id') id: string): Promise<DeleteUserResponseDto> {
    return this.usersService.remove(id);
  }

  @Post('emails')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obter emails de múltiplos usuários',
    description:
      'Retorna os emails de uma lista de usuários pelos seus IDs. Útil para operações em lote.',
  })
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'string',
        format: 'uuid',
      },
      example: [
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440001',
      ],
    },
    description: 'Array de UUIDs dos usuários',
  })
  @ApiOkResponse({
    description: 'Emails retornados com sucesso',
    type: UserEmailsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Array de IDs inválido ou vazio',
  })
  findAllEmails(@Body() userIds: string[]): Promise<UserEmailsResponseDto> {
    return this.usersService.findAllEmails(userIds);
  }
}
