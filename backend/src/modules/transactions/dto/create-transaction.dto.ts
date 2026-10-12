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

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum PaymentMethod {
  PIX = 'pix',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_SLIP = 'bank_slip',
  CASH = 'cash',
  TRANSFER = 'transfer',
  OTHER = 'other',
}

export class CreateTransactionDto {
  @IsUUID('4', {
    message: 'A empresa informada possui um identificador inválido.',
  })
  company_id: string;

  @IsOptional()
  @IsUUID('4', {
    message: 'A categoria informada possui um identificador inválido.',
  })
  category_id?: string;

  @IsEnum(TransactionType, {
    message: 'O tipo deve ser income ou expense.',
  })
  type: TransactionType;

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
  amount: number;

  @IsString({ message: 'A descrição deve ser um texto.' })
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  @MaxLength(255, {
    message: 'A descrição deve ter no máximo 255 caracteres.',
  })
  description: string;

  @IsEnum(PaymentMethod, {
    message: 'A forma de pagamento informada é inválida.',
  })
  payment_method: PaymentMethod;

  @IsDateString(
    {},
    { message: 'A data da movimentação deve ser uma data válida.' },
  )
  transaction_date: string;
}
