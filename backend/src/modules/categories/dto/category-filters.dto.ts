import { IsUUID } from 'class-validator';

export class CategoryFiltersDto {
  @IsUUID('4')
  company_id: string;
}
