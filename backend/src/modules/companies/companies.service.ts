import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { CreateCompanyDto } from './dto/create-company.dto';
import { CompaniesRepository } from './repositories/companies.repository';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(private readonly companiesRepository: CompaniesRepository) {}

  async findAll() {
    const { data, error } = await this.companiesRepository.findAll();

    if (error) {
      this.handleDatabaseError('listar empresas', error);
    }

    return data ?? [];
  }

  async findByUser(userId: string) {
    const { data, error } = await this.companiesRepository.findByUser(userId);

    if (error) {
      this.handleDatabaseError('listar empresas do usuário', error);
    }

    return (data ?? [])
      .filter((item) => item.companies)
      .map((item) => {
        const company = Array.isArray(item.companies)
          ? item.companies[0]
          : item.companies;

        return {
          ...company,
          role: item.role,
        };
      });
  }

  async create(dto: CreateCompanyDto, userId: string) {
    const { data: existingOwner, error: ownerError } =
      await this.companiesRepository.findOwnerMembership(userId);

    if (ownerError) {
      this.handleDatabaseError('verificar propriedade de empresa', ownerError);
    }

    if (existingOwner) {
      throw new ConflictException(
        'Você já possui uma empresa como proprietário.',
      );
    }

    const { data: company, error: companyError } =
      await this.companiesRepository.createCompany(dto);

    if (companyError) {
      this.handleDatabaseError('criar empresa', companyError);
    }

    if (!company) {
      throw new InternalServerErrorException(
        'Não foi possível confirmar a criação da empresa.',
      );
    }

    const { error: memberError } =
      await this.companiesRepository.createMembership(company.id, userId);

    if (memberError) {
      this.handleDatabaseError('vincular proprietário à empresa', memberError);
    }

    return company;
  }

  async findMembers(companyId: string, userId: string) {
    const { data: membership, error: membershipError } =
      await this.companiesRepository.findMembership(companyId, userId);

    if (membershipError) {
      this.handleDatabaseError('validar acesso à empresa', membershipError);
    }

    if (!membership) {
      throw new ForbiddenException('Você não possui acesso a esta empresa.');
    }

    const { data, error } =
      await this.companiesRepository.findMembers(companyId);

    if (error) {
      this.handleDatabaseError('listar membros da empresa', error);
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

    if (error.code === '23505') {
      throw new ConflictException(
        'Já existe um registro com os dados informados.',
      );
    }

    if (error.code === '23503') {
      throw new ConflictException(
        'A operação referencia um registro inexistente ou inválido.',
      );
    }

    if (error.code === '22P02') {
      throw new ConflictException(
        'Um dos identificadores ou valores informados é inválido.',
      );
    }

    throw new InternalServerErrorException(
      `Não foi possível ${operation}. Tente novamente mais tarde.`,
    );
  }
}
