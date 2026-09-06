import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionFiltersDto } from './dto/transaction-filters.dto';
import { TransactionsService } from './transactions.service';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Request() request: any,
    @Query() filters: TransactionFiltersDto,
  ) {
    return this.transactionsService.findByUser(request.user.id, filters);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() dto: CreateTransactionDto, @Request() request: any) {
    return this.transactionsService.create(dto, request.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
    @Request() request: any,
  ) {
    return this.transactionsService.update(id, dto, request.user.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() request: any) {
    return this.transactionsService.remove(id, request.user.id);
  }
}
