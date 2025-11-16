import { User } from '@modules/users/entities/user.entity';

export class AnnouncementResponseDto {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: User;
  createdAt: Date;
}

export class PaginatedAnnouncementsResponseDto {
  data: AnnouncementResponseDto[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}
