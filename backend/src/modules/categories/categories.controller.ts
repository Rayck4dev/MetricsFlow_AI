import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { CategoryFiltersDto } from './dto/category-filters.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findByCompany(
    @Query() filters: CategoryFiltersDto,
    @Request() request: any,
  ) {
    return this.categoriesService.findByCompany(filters, request.user.id);
  }
}
