import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';

import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';

interface AuthenticatedRequest {
  user: {
    id: string;
  };
}

@Controller('companies')
@UseGuards(AuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  findAll(@Request() request: AuthenticatedRequest) {
    return this.companiesService.findByUser(request.user.id);
  }

  @Get(':companyId/members')
  findMembers(
    @Param('companyId', new ParseUUIDPipe({ version: '4' }))
    companyId: string,
    @Request() request: AuthenticatedRequest,
  ) {
    return this.companiesService.findMembers(companyId, request.user.id);
  }

  @Post()
  create(
    @Body() dto: CreateCompanyDto,
    @Request() request: AuthenticatedRequest,
  ) {
    return this.companiesService.create(dto, request.user.id);
  }
}
