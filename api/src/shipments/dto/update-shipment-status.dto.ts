import { IsEnum, IsNotEmpty } from 'class-validator';
import { ShipmentStatus } from '../enum/shipment-status.enum.js';

export class UpdateShipmpentStatusDto {
  @IsNotEmpty()
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;

  shipmentId: number;
}
