import { Order } from "../models/order";

export function getOrderUnits(order: Order) {
  return order.items.reduce((acc, cur) => (acc += cur.units), 0);
}
