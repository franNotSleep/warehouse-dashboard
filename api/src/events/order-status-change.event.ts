import { EventEmitter2 } from '@nestjs/event-emitter';
import { BaseEvent } from './base.event.js';
import { OrderStatus } from '../orders/enum/order-status.enum.js';

export type OrderStatusChangePayload = {
  orderId: number;
  previousStatus: OrderStatus;
  newStatus: OrderStatus;
};

export class OrderStatusChangeEvent extends BaseEvent<OrderStatusChangePayload> {
  protected eventKey = 'order.status.changed';

  constructor(emitter: EventEmitter2, payload: OrderStatusChangePayload) {
    super(emitter, payload);
  }
}
