import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() request: any) {
    return this.companiesService.findByUser(request.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':companyId/members')
  async findMembers(
    @Param('companyId') companyId: string,
    @Request() request: any,
  ) {
    return this.companiesService.findMembers(companyId, request.user.id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() dto: CreateCompanyDto, @Request() request: any) {
    return this.companiesService.create(dto, request.user.id);
  }
}
