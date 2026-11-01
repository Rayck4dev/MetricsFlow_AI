import { BadRequestException } from '@nestjs/common';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

export function toTransactionUpdateData(dto: UpdateTransactionDto) {
  const updateData: Record<string, unknown> = {};

  if (dto.type !== undefined) updateData.type = dto.type;
  if (dto.category_id !== undefined) updateData.category_id = dto.category_id;
  if (dto.amount !== undefined) updateData.amount = dto.amount;
  if (dto.description !== undefined)
    updateData.description = dto.description.trim();
  if (dto.payment_method !== undefined) {
    updateData.payment_method = dto.payment_method;
  }
  if (dto.transaction_date !== undefined) {
    updateData.transaction_date = dto.transaction_date;
  }

  if (Object.keys(updateData).length === 0) {
    throw new BadRequestException(
      'Informe pelo menos um campo para atualizar.',
    );
  }

  return updateData;
}
