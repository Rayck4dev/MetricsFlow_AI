import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';

import { CategoriesService } from './categories.service';
import { CategoryFiltersDto } from './dto/category-filters.dto';

interface AuthenticatedRequest {
  user: {
    id: string;
  };
}

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findByCompany(
    @Query() filters: CategoryFiltersDto,
    @Request() request: AuthenticatedRequest,
  ) {
    return this.categoriesService.findByCompany(filters, request.user.id);
  }
}
