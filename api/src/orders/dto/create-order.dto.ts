import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsString,
  MaxLength,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderPriority } from '../enum/order-priority.enum.js';

class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  itemId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  units: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  pallets: number;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderItemDto)
  lineItems: OrderItemDto[];

  @IsEnum(OrderPriority)
  @IsNotEmpty()
  priority: OrderPriority;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  carrier: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  dock: string;

  @IsISO8601()
  @IsNotEmpty()
  eta: Date;
}
