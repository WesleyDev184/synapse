import { ApplicationStatus } from '../entities/application.entity';

export class ApplicationResponseDto {
  id: string;
  name: string;
  email: string;
  company: string;
  reason: string;
  status: ApplicationStatus;
  reviewedById?: string;
  createdAt: Date;
}

export class PaginatedApplicationsResponseDto {
  data: ApplicationResponseDto[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}
