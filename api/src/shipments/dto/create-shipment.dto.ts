import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateOutboundShipmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  carrier: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  dock: string;

  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsISO8601()
  @IsNotEmpty()
  eta: Date;
}
