import { IsUUID } from 'class-validator';

export class CategoryFiltersDto {
  @IsUUID()
  company_id: string;
}
