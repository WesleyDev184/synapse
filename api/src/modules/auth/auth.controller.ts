import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ExceptionInterceptor } from '@shared/interceptors/exception.interceptor';
import { AuthService } from './auth.service';
import { LoginDto, ResponseTokensDto } from './dto/login.dto';

/**
 * Autenticação
 * Endpoints para autenticação de usuários e gerenciamento de tokens JWT.
 * Fornece login e renovação de tokens de acesso.
 */
@Controller('auth')
@UseInterceptors(ExceptionInterceptor)
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Fazer login de usuário',
    description:
      'Autentica um usuário com email e senha, retornando access token e refresh token para autenticação subsequente.',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciais do usuário (email e senha)',
    examples: {
      success: {
        value: {
          email: 'usuario@example.com',
          password: 'SenhaForte@123',
        },
        description: 'Credenciais válidas',
      },
    },
  })
  @ApiOkResponse({
    description: 'Login bem-sucedido. Retorna access token e refresh token.',
    type: ResponseTokensDto,
  })
  @ApiBadRequestResponse({
    description: 'Email ou senha ausentes ou em formato inválido',
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas: email ou senha incorretos',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor durante autenticação',
  })
  async login(@Body() loginDto: LoginDto): Promise<ResponseTokensDto> {
    return await this.authService.login(loginDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renovar token de acesso',
    description:
      'Renova o access token utilizando um refresh token válido. Retorna um novo par de access token e refresh token.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          description:
            'Refresh token válido emitido no login ou renovação anterior',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpYXQiOjE2OTc1NTU1NTUsImV4cCI6MTcwMDEzNzk1NX0.efgh5678',
        },
      },
      required: ['refreshToken'],
    },
    description: 'Refresh token para renovação',
  })
  @ApiOkResponse({
    description:
      'Token renovado com sucesso. Retorna novo access token e refresh token.',
    type: ResponseTokensDto,
  })
  @ApiBadRequestResponse({
    description: 'Refresh token ausente ou em formato inválido',
  })
  @ApiUnauthorizedResponse({
    description:
      'Refresh token inválido, expirado ou não encontrado. Faça login novamente.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor durante renovação de token',
  })
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<ResponseTokensDto> {
    return await this.authService.refreshToken(refreshToken);
  }
}
