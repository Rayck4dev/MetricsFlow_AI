import { Injectable, Logger } from '@nestjs/common';
import { MetaService } from '../meta.service';

@Injectable()
export class MessageResponseService {
  private readonly logger = new Logger(MessageResponseService.name);

  constructor(private readonly metaService: MetaService) {}

  async sendReply(phoneNumber: string, message: string): Promise<void> {
    try {
      await this.metaService.sendWhatsAppText(phoneNumber, message);
    } catch (error) {
      this.logger.error(
        'Falha ao enviar resposta pelo WhatsApp.',
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
