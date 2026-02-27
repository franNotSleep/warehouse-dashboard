import { EventEmitter2 } from '@nestjs/event-emitter';

export abstract class BaseEvent<TPayload> {
  protected abstract readonly eventKey: string;

  constructor(
    protected readonly emitter: EventEmitter2,
    protected readonly payload: TPayload,
  ) {}

  emit(): void {
    this.emitter.emit(this.eventKey, { ...this.payload, event: this.eventKey });
  }
}
