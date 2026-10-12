import { Inject, Injectable } from '@nestjs/common';

import {
  MESSAGE_INTENT_STRATEGIES,
  MessageIntentContext,
  MessageIntentStrategy,
} from './message-intent.strategy';

@Injectable()
export class MessageIntentResolverService {
  constructor(
    @Inject(MESSAGE_INTENT_STRATEGIES)
    private readonly strategies: MessageIntentStrategy[],
  ) {}

  resolve(context: MessageIntentContext): MessageIntentStrategy | null {
    return (
      this.strategies.find((strategy) => strategy.canHandle(context)) ?? null
    );
  }
}
