import { EventEmitter2 } from '@nestjs/event-emitter';
import { BaseEvent } from './base.event.js';
import { ShipmentStatus } from '../shipments/enum/shipment-status.enum.js';
import { ShipmentType } from '../shipments/enum/shipment-type.enum.js';

export type ShipmentStatusChangePayload = {
  shipmentId: number;
  previousStatus: ShipmentStatus;
  newStatus: ShipmentStatus;
  type: ShipmentType;
};

export class ShipmentStatusChangeEvent extends BaseEvent<ShipmentStatusChangePayload> {
  protected eventKey = 'shipment.status.changed';

  constructor(emitter: EventEmitter2, payload: ShipmentStatusChangePayload) {
    super(emitter, payload);
  }
}
