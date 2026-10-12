import { Module } from '@nestjs/common';

import { ParserService } from './parser.service';
import { TranscriptionService } from './transcription.service';
import { FallbackParserService } from './parser/fallback-parser.service';
import { OpenAIParserService } from './parser/openai-parser.service';

@Module({
  providers: [
    ParserService,
    TranscriptionService,
    FallbackParserService,
    OpenAIParserService,
  ],
  exports: [ParserService, TranscriptionService],
})
export class AiModule {}
