import { Module } from '@nestjs/common';
import { ShipmentsService } from './shipments.service.js';
import { ShipmentsController } from './shipments.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './entities/shipment.entity.js';
import { ShipmentsTask } from './shipments.task.js';

@Module({
  controllers: [ShipmentsController],
  imports: [TypeOrmModule.forFeature([Shipment])],
  providers: [ShipmentsService, ShipmentsTask],
})
export class ShipmentsModule {}
