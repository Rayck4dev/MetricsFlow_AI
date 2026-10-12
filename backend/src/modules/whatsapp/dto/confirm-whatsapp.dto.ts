import { IsOptional, IsUUID } from 'class-validator';

export class ConfirmWhatsappDto {
  @IsOptional()
  @IsUUID('4')
  pendingTransactionId?: string;

  @IsOptional()
  @IsUUID('4')
  pending_transaction_id?: string;
}
