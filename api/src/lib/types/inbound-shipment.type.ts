import { Shipment } from '../../shipments/entities/shipment.entity.js';
import { ShipmentType } from '../../shipments/enum/shipment-type.enum.js';

export type InboundShipment = Omit<Shipment, 'type'> & {
  type: ShipmentType.INBOUND;
};
