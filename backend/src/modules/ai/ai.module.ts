import { Module } from '@nestjs/common';

import { ParserService } from './parser.service';
import { TranscriptionService } from './transcription.service';

@Module({
  providers: [ParserService, TranscriptionService],
  exports: [ParserService, TranscriptionService],
})
export class AiModule {}
