import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity.js';
import { OrderItem } from './entities/order-items.entity.js';
import { Item } from '../items/items.entity.js';

@Module({
  controllers: [OrdersController],
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Item])],
  providers: [OrdersService],
})
export class OrdersModule {}
