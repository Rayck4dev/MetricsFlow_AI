import { Injectable } from '@nestjs/common';
import { formatMessageTime } from './financial-message.utils';

@Injectable()
export class WhatsappHistoryService {
  constructor(private readonly whatsappRepository: any) {}

  async getFormattedHistory(companyId: string) {
    const history =
      await this.whatsappRepository.findHistoryByCompany(companyId);

    return [...(history ?? [])].reverse().map((m) => ({
      ...m,
      time: formatMessageTime(m.created_at),
    }));
  }

  async saveMessageLog(data: any) {
    return this.whatsappRepository.createLog(data);
  }
}
