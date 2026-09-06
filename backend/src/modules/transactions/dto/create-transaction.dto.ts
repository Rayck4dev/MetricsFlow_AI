import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
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
  @IsUUID()
  company_id: string;

  @IsUUID()
  @IsOptional()
  category_id?: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @IsDateString()
  transaction_date: string;
}
