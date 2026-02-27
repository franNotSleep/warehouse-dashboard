import { Controller, Get, Sse } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { map, Subject } from 'rxjs';
import { OnEvent } from '@nestjs/event-emitter';
import { ShipmentStatusChangeEvent } from '../events/shipment-status-change.event.js';
import { OrderStatusChangeEvent } from '../events/order-status-change.event.js';

@Controller('api/dashboard')
export class DashboardController {
  private eventSubject = new Subject();

  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpis')
  kpis() {
    return this.dashboardService.kpis();
  }

  @Get('board')
  board() {
    return this.dashboardService.board();
  }

  @Sse('watch')
  watch() {
    return this.eventSubject.asObservable().pipe(
      map((data: { event: string }) => ({
        event: data.event,
        data: { ...data },
      })),
    );
  }

  @OnEvent('shipment.status.changed')
  handleShipmentStatusChanged(event: ShipmentStatusChangeEvent) {
    this.eventSubject.next(event);
  }

  @OnEvent('order.status.changed')
  handleOrderStatusChanged(event: OrderStatusChangeEvent) {
    this.eventSubject.next(event);
  }

  @OnEvent('order.new')
  handleNewOrder(event: any) {
    this.eventSubject.next(event);
  }
}
