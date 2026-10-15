import { Module } from '@nestjs/common';

import { ParserService } from './parser.service';
import { TranscriptionService } from './transcription.service';
import { FallbackParserService } from './parser/fallback-parser.service';
import { GroqParserService } from './parser/groq-parser.service';

@Module({
  providers: [
    ParserService,
    TranscriptionService,
    FallbackParserService,
    GroqParserService,
  ],
  exports: [ParserService, TranscriptionService],
})
export class AiModule {}
