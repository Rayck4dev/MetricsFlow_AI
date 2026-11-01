import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { User } from '@supabase/supabase-js';

import { CompaniesService } from '../../companies/companies.service';
import type { ConnectWhatsappDto } from '../dto/connect-whatsapp.dto';
import { MetaService } from '../meta.service';
import { WhatsappConnectionsRepository } from '../repositories/whatsapp-connections.repository';

@Injectable()
export class WhatsappConnectionService {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly connectionsRepository: WhatsappConnectionsRepository,
    private readonly metaService: MetaService,
  ) {}

  async getUserCompany(userId: string) {
    const companies = await this.companiesService.findByUser(userId);

    if (!companies.length) {
      throw new BadRequestException(
        'Usuário não está vinculado a uma empresa.',
      );
    }

    return companies[0];
  }

  async getConnection(user: User) {
    const { data, error } = await this.connectionsRepository.findByUser(
      user.id,
    );

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível consultar a conexão do WhatsApp.',
      );
    }

    return {
      connection: data ?? null,
    };
  }

  async connectWhatsApp(body: ConnectWhatsappDto, user: User) {
    const phoneNumber = body.phoneNumber?.trim() ?? '';
    const normalized = this.metaService.normalizePhone(phoneNumber);

    if (!/^\d{10,15}$/.test(normalized)) {
      throw new BadRequestException('Informe um número válido com DDI e DDD.');
    }

    const company = await this.getUserCompany(user.id);

    const { data, error } = await this.connectionsRepository.upsertConnection(
      user.id,
      company.id,
      normalized,
    );

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível registrar o número do WhatsApp.',
      );
    }

    return {
      ok: true,
      connection: data,
      message:
        'Número registrado. A verificação ainda precisa ser implementada.',
    };
  }
}
