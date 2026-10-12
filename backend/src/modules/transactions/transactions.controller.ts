import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionFiltersDto } from './dto/transaction-filters.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

interface AuthenticatedRequest {
  user: {
    id: string;
  };
}

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(
    @Request() request: AuthenticatedRequest,
    @Query() filters: TransactionFiltersDto,
  ) {
    return this.transactionsService.findByUser(request.user.id, filters);
  }

  @Post()
  create(
    @Body() dto: CreateTransactionDto,
    @Request() request: AuthenticatedRequest,
  ) {
    return this.transactionsService.create(dto, request.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateTransactionDto,
    @Request() request: AuthenticatedRequest,
  ) {
    return this.transactionsService.update(id, dto, request.user.id);
  }

  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Request() request: AuthenticatedRequest,
  ) {
    return this.transactionsService.remove(id, request.user.id);
  }
}
