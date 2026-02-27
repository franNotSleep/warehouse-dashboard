import { Injectable } from '@nestjs/common';
import { Repository, DataSource, LessThanOrEqual } from 'typeorm';
import { Shipment } from './entities/shipment.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateShipmpentStatusDto } from './dto/update-shipment-status.dto.js';
import { CreateOutboundShipmentDto } from './dto/create-shipment.dto.js';
import { ShipmentType } from './enum/shipment-type.enum.js';
import { ShipmentStatus } from './enum/shipment-status.enum.js';
import { Order } from '../orders/entities/order.entity.js';
import { OrderStatus } from '../orders/enum/order-status.enum.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ShipmentStatusChangeEvent } from '../events/shipment-status-change.event.js';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentsRepository: Repository<Shipment>,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createOutbound(dto: CreateOutboundShipmentDto) {
    let outShipmentId!: number;
    await this.dataSource.transaction(async (manager) => {
      const orderRepo = manager.getRepository(Order);
      const shipmentRepo = manager.getRepository(Shipment);

      const outShipment = await shipmentRepo.save(
        shipmentRepo.create({
          dock: dto.dock,
          eta: dto.eta,
          carrier: dto.carrier,
          type: ShipmentType.OUTBOUND,
          status: ShipmentStatus.LOADING,
        }),
      );

      await orderRepo.update(
        { id: dto.orderId },
        { outShipmentId: outShipment.id, status: OrderStatus.PICKING },
      );

      const event = new ShipmentStatusChangeEvent(this.eventEmitter, {
        shipmentId: outShipment.id,
        newStatus: ShipmentStatus.LOADING,
        previousStatus: ShipmentStatus.LOADING,
        type: ShipmentType.OUTBOUND,
      });

      event.emit();

      outShipmentId = outShipment.id;
    });

    return this.shipmentsRepository.findOne({
      where: { id: outShipmentId },
      relations: { outOrder: { items: { item: true } } },
    });
  }

  async markAsDelayed() {
    const nowPlus30Min = new Date();
    nowPlus30Min.setMinutes(nowPlus30Min.getMinutes() + 30);

    await this.shipmentsRepository.update(
      {
        type: ShipmentType.OUTBOUND,
        eta: LessThanOrEqual(nowPlus30Min),
        status: ShipmentStatus.LOADING,
      },
      {
        status: ShipmentStatus.DELAYED,
      },
    );
  }

  findAll() {
    return this.shipmentsRepository.find({
      order: { createdAt: 'desc' },
      relations: {
        outOrder: true,
        inOrder: true,
      },
    });
  }

  async updateShipmentStatus({ shipmentId, status }: UpdateShipmpentStatusDto) {
    const shipment = await this.shipmentsRepository.findOne({
      where: { id: shipmentId },
    });

    if (!shipment) return null;

    const event = new ShipmentStatusChangeEvent(this.eventEmitter, {
      shipmentId,
      newStatus: status,
      previousStatus: shipment.status,
      type: shipment.type,
    });

    const result = await this.shipmentsRepository.update(
      {
        id: shipmentId,
      },
      { status: status },
    );

    event.emit();

    return result;
  }
}
