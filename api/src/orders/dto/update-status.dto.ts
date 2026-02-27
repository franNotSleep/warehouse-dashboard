import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../enum/order-status.enum.js';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  orderId: number;
}
