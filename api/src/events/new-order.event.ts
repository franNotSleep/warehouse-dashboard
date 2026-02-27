import { EventEmitter2 } from '@nestjs/event-emitter';
import { BaseEvent } from './base.event.js';

export type OrderNewPayload = {
  orderId: number;
};

export class OrderNewEvent extends BaseEvent<OrderNewPayload> {
  protected eventKey = 'order.new';

  constructor(emitter: EventEmitter2, payload: OrderNewPayload) {
    super(emitter, payload);
  }
}
