import { Shipment, ShipmentType } from "@/models/shipment";

export type OutboundShipment = Omit<Shipment, "type"> & {
  type: ShipmentType.OUTBOUND;
};
