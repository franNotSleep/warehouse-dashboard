import { Order } from "./order";

export enum ShipmentType {
  INBOUND = "inbound",
  OUTBOUND = "outbound",
}

export enum ShipmentStatus {
  ARRIVED = "arrived",
  UNLOADING = "unloading",
  SCHEDULED = "scheduled",
  READY = "ready",
  LOADING = "loading",
  DELAYED = "delayed",
}

export type Shipment = {
  id: number;
  type: ShipmentType;
  carrier: string;
  inOrder?: Order;
  outOrder?: Order;
  status: ShipmentStatus;
  dock: string;
  eta: Date;
  createdAt: Date;
  updatedAt: Date;
};
