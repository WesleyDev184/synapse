import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { In, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import {
  CreateUserResponseDto,
  DeleteUserResponseDto,
  FindByEmailResponseDto,
  PaginatedUsersResponseDto,
  ResponseUserDto,
  UpdateUserResponseDto,
  UserEmailsResponseDto,
} from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    const { name, email, password, company } = createUserDto;

    // Verificar se email já existe
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar usuário (o ID será gerado pelo banco de dados)
    const user = this.usersRepository.create({
      name,
      email,
      company,
      passwordHash,
    });

    const savedUser = await this.usersRepository.save(user);

    return this.mapToResponseDto(savedUser);
  }

  async findAll(
    page: number = 1,
    size: number = 10,
    search?: string,
  ): Promise<PaginatedUsersResponseDto> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.where(
        'user.name ILIKE :search OR user.email ILIKE :search',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * size)
      .take(size);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users.map((user) => this.mapToResponseDto(user)),
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
    };
  }

  async findOne(id: string): Promise<ResponseUserDto> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.mapToResponseDto(user);
  }

  async findByEmail(email: string): Promise<FindByEmailResponseDto | null> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'passwordHash'],
    });

    if (!user) {
      return null;
    }

    if (!user.passwordHash) {
      throw new NotFoundException(
        `Password hash not found for user with email ${email}`,
      );
    }

    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Validar se novo email já existe
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    // Hash da senha se fornecida
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Atualizar timestamp
    const updateData = {
      ...updateUserDto,
      passwordHash: updateUserDto.password,
      updatedAt: new Date(),
    };
    delete updateData.password;

    // Mesclar dados e salvar
    Object.assign(user, updateData);
    const updatedUser = await this.usersRepository.save(user);

    return this.mapToResponseDto(updatedUser);
  }

  async remove(id: string): Promise<DeleteUserResponseDto> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Soft delete
    user.deletedAt = new Date();
    await this.usersRepository.save(user);

    return {
      message: `User ${id} deleted successfully`,
      id,
    };
  }

  async findAllEmails(userIds: string[]): Promise<UserEmailsResponseDto> {
    const users = await this.usersRepository.find({
      select: ['email'],
      where: { id: In(userIds) },
    });

    if (users.length !== userIds.length) {
      throw new NotFoundException('One or more users not found');
    }

    return {
      emails: users.map((user) => user.email),
      count: users.length,
    };
  }

  /**
   * Helper: Mapear entidade para DTO
   */
  private mapToResponseDto(user: User): ResponseUserDto {
    const dto = new ResponseUserDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.company = user.company;
    dto.role = user.role;
    dto.status = user.status;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
