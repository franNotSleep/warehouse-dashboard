import { Injectable } from '@nestjs/common';
import { Repository, Not, In } from 'typeorm';
import { Order } from '../orders/entities/order.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipment } from '../shipments/entities/shipment.entity.js';
import { ShipmentType } from '../shipments/enum/shipment-type.enum.js';
import { InboundShipment } from '../lib/types/inbound-shipment.type.js';
import { OutboundShipment } from '../lib/types/outbound-shipment.type.js';
import { OrderStatus } from '../orders/enum/order-status.enum.js';
import { ShipmentStatus } from '../shipments/enum/shipment-status.enum.js';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Shipment)
    private readonly shipmentsRepository: Repository<Shipment>,
  ) {}

  async kpis() {
    const sql = `
      SELECT 
        SUM(oi.units) "units",
        SUM(orders.pallets) "pallets",
        COUNT(*) 
      FROM orders JOIN orders_items oi ON oi.order_id = orders.id;`;

    const [{ units, pallets, count }]: Array<{
      units: number;
      pallets: number;
      count: number;
    }> = await this.ordersRepository.query(sql);

    return {
      ordersCount: +count,
      totalUnits: +units,
      totalPallets: pallets || 0,
      percentageOnTime: (await this.getPercentageOnTime()) || 0,
    };
  }

  async board() {
    const data: {
      receiving: Array<InboundShipment>;
      outbound: Array<OutboundShipment>;
      auditing: {
        pending: number;
        passRate: number;
        orders: Order[];
      };
      putAway: {
        pending: number;
        inProgress: number;
        occupied: number;
        capacity: number;
        orders: Order[];
      };
      picking: Order[];
    } = {
      outbound: [],
      receiving: [],
      auditing: {
        pending: 0,
        passRate: 0,
        orders: [],
      },
      putAway: {
        pending: 0,
        inProgress: 0,
        occupied: 0,
        capacity: 500,
        orders: [],
      },
      picking: [],
    };

    const shipments = await this.shipmentsRepository.find({
      relations: { outOrder: { items: true }, inOrder: { items: true } },
    });

    const pending = await this.ordersRepository.sum('pallets', {
      status: OrderStatus.RECEIVING,
    });

    const {
      pickingOrders,
      passRate,
      inProgressOrders,
      auditingOrders,
      waitingForAuditing,
    } = await this.getBoardOrders();

    const inProgressCount = inProgressOrders.reduce(
      (acc, cur) => (acc += cur.pallets),
      0,
    );

    const occupied = await this.ordersRepository.countBy({
      status: Not(In([OrderStatus.RECEIVING, OrderStatus.SHIPPING])),
    });

    data.putAway.orders = inProgressOrders;
    data.putAway.inProgress = inProgressCount;
    data.putAway.occupied = occupied;
    data.putAway.pending = pending || 0;

    data.auditing.orders = auditingOrders;
    data.auditing.passRate = passRate;
    data.auditing.pending = waitingForAuditing;

    data.picking = pickingOrders;

    shipments.forEach((shipment) => {
      if (shipment.type === ShipmentType.INBOUND) {
        data.receiving.push(shipment as InboundShipment);
      } else {
        data.outbound.push(shipment as OutboundShipment);
      }
    });

    return data;
  }

  private async getBoardOrders() {
    const orders = await this.ordersRepository.find({
      relations: { items: { item: true }, outShipment: true },
    });

    const inProgressOrders: Order[] = [];
    const pickingOrders: Order[] = [];
    const auditingOrders: Order[] = [];

    let passedOrders = 0;
    let failedOrders = 0;
    let waitingForAuditing = 0;

    orders.forEach((o) => {
      switch (o.status) {
        case OrderStatus.RECEIVING:
          break;
        case OrderStatus.PUTTING_AWAY:
          inProgressOrders.push(o);
          break;
        case OrderStatus.PICKING:
          pickingOrders.push(o);
          break;
        case OrderStatus.AUDITING:
          auditingOrders.push(o);
          waitingForAuditing++;
          break;
        case OrderStatus.PASSED:
          auditingOrders.push(o);
          passedOrders++;
          break;
        case OrderStatus.FAILED:
          auditingOrders.push(o);
          failedOrders++;
          break;
        case OrderStatus.SHIPPING:
      }
    });

    return {
      inProgressOrders,
      pickingOrders,
      auditingOrders,
      waitingForAuditing,
      passRate: Math.ceil((passedOrders / (passedOrders + failedOrders)) * 100),
    };
  }

  private async getPercentageOnTime() {
    let totalReady = 0;
    let totalLoading = 0;
    let totalDelayed = 0;

    const sql = `
      SELECT 
        COUNT(*),
        status
      FROM shipments
      WHERE type = '${ShipmentType.OUTBOUND}'
      GROUP BY status;
    `;

    const rows: Array<{ count: number; status: ShipmentStatus }> =
      await this.shipmentsRepository.query(sql);

    rows.forEach((row) => {
      switch (row.status) {
        case ShipmentStatus.DELAYED:
          totalDelayed += +row.count;
          break;
        case ShipmentStatus.READY:
          totalReady += +row.count;
          break;
        case ShipmentStatus.LOADING:
          totalLoading += +row.count;
          break;
      }
    });

    return Math.ceil(
      (totalDelayed / (totalDelayed + totalLoading + totalReady)) * 100,
    );
  }
}
