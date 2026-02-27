import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { DataSource, FindOptionsRelations, Repository } from 'typeorm';
import { Order } from './entities/order.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from './enum/order-status.enum.js';
import { OrderItem } from './entities/order-items.entity.js';
import { UpdateOrderStatusDto } from './dto/update-status.dto.js';
import { Shipment } from '../shipments/entities/shipment.entity.js';
import { ShipmentType } from '../shipments/enum/shipment-type.enum.js';
import { ShipmentStatus } from '../shipments/enum/shipment-status.enum.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderStatusChangeEvent } from '../events/order-status-change.event.js';
import { OrderNewEvent } from '../events/new-order.event.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateOrderDto) {
    let id!: number;
    await this.dataSource.transaction(async (manager) => {
      const orderRepo = manager.getRepository<Order>(Order);
      const orderItemsRepo = manager.getRepository<OrderItem>(OrderItem);
      const shipmentsRepo = manager.getRepository<Shipment>(Shipment);

      const shipment = await shipmentsRepo.save(
        shipmentsRepo.create({
          type: ShipmentType.INBOUND,
          carrier: dto.carrier,
          status: ShipmentStatus.SCHEDULED,
          dock: dto.dock,
          eta: dto.eta,
        }),
      );

      const order = await orderRepo.save(
        orderRepo.create({
          priority: dto.priority,
          pallets: dto.pallets,
          status: OrderStatus.RECEIVING,
          inShipmentId: shipment.id,
        }),
      );

      await Promise.all(
        dto.lineItems.map((item) => {
          return orderItemsRepo.save(
            orderItemsRepo.create({
              itemId: item.itemId,
              orderId: order.id,
              units: item.units,
            }),
          );
        }),
      );

      id = order.id;
    });

    new OrderNewEvent(this.eventEmitter, {
      orderId: id,
    }).emit();

    return this.ordersRepository.findOne({
      where: { id },
      relations: { items: { item: true } },
    });
  }

  findAll() {
    return this.ordersRepository.find({
      order: { createdAt: 'desc' },
      relations: { items: { item: true }, inShipment: true, outShipment: true },
    });
  }

  async updateOrderStatus({ orderId, status }: UpdateOrderStatusDto) {
    const order = await this.findOne(orderId, {
      inShipment: true,
      outShipment: true,
    });

    if (!order) return null;

    switch (status) {
      case OrderStatus.PUTTING_AWAY:
        await this.handlePuttingAwayStatusChange(order);
        break;
    }

    const result = await this.ordersRepository.update(
      {
        id: orderId,
      },
      { status: status },
    );

    new OrderStatusChangeEvent(this.eventEmitter, {
      orderId: order.id,
      previousStatus: order.status,
      newStatus: status,
    }).emit();

    return result;
  }

  findOne(id: number, relations?: FindOptionsRelations<Order>) {
    return this.ordersRepository.findOne({ where: { id }, relations });
  }

  private async handlePuttingAwayStatusChange(order: Order) {
    await this.dataSource.transaction(async (manager) => {
      const orderRepo = manager.getRepository<Order>(Order);
      const shipmentsRepo = manager.getRepository<Shipment>(Shipment);

      await orderRepo.update(
        { id: order.id },
        { status: OrderStatus.PUTTING_AWAY },
      );
      await shipmentsRepo.update(
        { id: order.inShipmentId },
        { status: ShipmentStatus.READY },
      );
    });
  }
}
