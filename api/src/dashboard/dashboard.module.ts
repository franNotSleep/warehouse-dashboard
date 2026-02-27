import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { DashboardController } from './dashboard.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity.js';
import { Shipment } from '../shipments/entities/shipment.entity.js';

@Module({
  controllers: [DashboardController],
  imports: [TypeOrmModule.forFeature([Order, Shipment])],
  providers: [DashboardService],
})
export class DashboardModule {}
