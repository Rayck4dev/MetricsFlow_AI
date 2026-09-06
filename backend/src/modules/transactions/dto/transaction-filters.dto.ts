import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';

import { TransactionType } from './create-transaction.dto';

export class TransactionFiltersDto {
  @IsOptional()
  @IsUUID()
  company_id?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;
}
