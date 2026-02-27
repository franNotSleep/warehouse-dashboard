import { ShipmentType } from '../../shipments/enum/shipment-type.enum.js';
import { Shipment } from '../../shipments/entities/shipment.entity.js';

export type OutboundShipment = Omit<Shipment, 'type'> & {
  type: ShipmentType.OUTBOUND;
};
