import { ShipmentStatus, ShipmentType } from "../../models/shipment";

export type ShipmentStatusChangePayload = {
  shipmentId: number;
  previousStatus: ShipmentStatus;
  newStatus: ShipmentStatus;
  type: ShipmentType;
  event: "shipment.status.changed";
};
