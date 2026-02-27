import { Controller, Body, Get, Patch, Param, Post } from '@nestjs/common';
import { ShipmentsService } from './shipments.service.js';
import { UpdateShipmpentStatusDto } from './dto/update-shipment-status.dto.js';
import { CreateOutboundShipmentDto } from './dto/create-shipment.dto.js';

@Controller('api/shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post()
  createOutbound(@Body() dto: CreateOutboundShipmentDto) {
    return this.shipmentsService.createOutbound(dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') shipmentId: string,
    @Body() dto: UpdateShipmpentStatusDto,
  ) {
    return this.shipmentsService.updateShipmentStatus({
      ...dto,
      shipmentId: +shipmentId,
    });
  }

  @Get()
  findAll() {
    return this.shipmentsService.findAll();
  }
}
