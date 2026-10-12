import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { PaymentMethod, TransactionType } from './create-transaction.dto';

export class UpdateTransactionDto {
  @IsOptional()
  @IsEnum(TransactionType, {
    message: 'O tipo deve ser income ou expense.',
  })
  type?: TransactionType;

  @IsOptional()
  @IsUUID('4', {
    message: 'O identificador da categoria é inválido.',
  })
  category_id?: string;

  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 },
    {
      message: 'O valor deve ser um número válido com até duas casas decimais.',
    },
  )
  @Min(0.01, { message: 'O valor deve ser maior que zero.' })
  @Max(9999999999999.99, {
    message: 'O valor informado excede o limite permitido.',
  })
  amount?: number;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto.' })
  @IsNotEmpty({ message: 'A descrição não pode ficar vazia.' })
  @MaxLength(255, {
    message: 'A descrição deve ter no máximo 255 caracteres.',
  })
  description?: string;

  @IsOptional()
  @IsEnum(PaymentMethod, {
    message: 'A forma de pagamento informada é inválida.',
  })
  payment_method?: PaymentMethod;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'A data da movimentação deve ser uma data válida.' },
  )
  transaction_date?: string;
}
