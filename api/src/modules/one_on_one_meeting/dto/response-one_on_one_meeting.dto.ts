import { User } from '@modules/users/entities/user.entity';

export class OneOnOneMeetingResponseDto {
  id: string;
  member1Id: string;
  member1?: User;
  member2Id: string;
  member2?: User;
  date: Date;
  notes?: string;
  createdAt: Date;
}

export class PaginatedOneOnOneMeetingsResponseDto {
  data: OneOnOneMeetingResponseDto[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}
