import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { CategoryFiltersDto } from './dto/category-filters.dto';
import { CategoriesRepository } from './repositories/categories.repository';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async findByCompany(filters: CategoryFiltersDto, userId: string) {
    const { data: membership, error: membershipError } =
      await this.categoriesRepository.findMembership(
        filters.company_id,
        userId,
      );

    if (membershipError) {
      this.handleDatabaseError('validar acesso à empresa', membershipError);
    }

    if (!membership) {
      throw new ForbiddenException('Você não possui acesso a esta empresa.');
    }

    const { data, error } = await this.categoriesRepository.findByCompany(
      filters.company_id,
    );

    if (error) {
      this.handleDatabaseError('listar categorias', error);
    }

    return data ?? [];
  }

  private handleDatabaseError(
    operation: string,
    error: { message: string; code?: string },
  ): never {
    this.logger.error(
      `Falha ao ${operation}. Código: ${error.code ?? 'desconhecido'}.`,
      error.message,
    );

    throw new InternalServerErrorException(
      `Não foi possível ${operation}. Tente novamente mais tarde.`,
    );
  }
}
