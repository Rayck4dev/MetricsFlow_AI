import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';

import { TransactionType } from './create-transaction.dto';

export class TransactionFiltersDto {
  @IsOptional()
  @IsUUID('4', {
    message: 'O identificador da empresa é inválido.',
  })
  company_id?: string;

  @IsOptional()
  @IsEnum(TransactionType, {
    message: 'O tipo deve ser income ou expense.',
  })
  type?: TransactionType;

  @IsOptional()
  @IsDateString({}, { message: 'A data inicial informada é inválida.' })
  start_date?: string;

  @IsOptional()
  @IsDateString({}, { message: 'A data final informada é inválida.' })
  end_date?: string;

  @IsOptional()
  @IsUUID('4', {
    message: 'O identificador da categoria é inválido.',
  })
  category_id?: string;
}
