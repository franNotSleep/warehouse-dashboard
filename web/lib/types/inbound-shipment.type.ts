import { Shipment, ShipmentType } from "@/models/shipment";

export type InboundShipment = Omit<Shipment, "type"> & {
  type: ShipmentType.INBOUND;
};
