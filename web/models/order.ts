import { OrderItem } from "./order-item";
import { Shipment } from "./shipment";

export enum OrderStatus {
  RECEIVING = "receiving",
  PUTTING_AWAY = "putting_away",
  PICKING = "picking",
  AUDITING = "auditing",
  PASSED = "passed",
  FAILED = "failed",
  SHIPPING = "shipping",
}

export enum OrderPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export type Order = {
  id: number;
  pallets: number;
  items: OrderItem[];
  inShipment?: Shipment;
  outShipment?: Shipment;
  priority: OrderPriority;
  status: OrderStatus;
  createdAt: Date;
  upatedAt: Date;
};
