import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ShipmentType } from '../enum/shipment-type.enum.js';
import { ShipmentStatus } from '../enum/shipment-status.enum.js';
import { Order } from '../../orders/entities/order.entity.js';

@Entity({ name: 'shipments' })
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type', type: 'enum', enum: ShipmentType })
  type: ShipmentType;

  @Column({ name: 'carrier', type: 'text' })
  carrier: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ShipmentStatus,
  })
  status: ShipmentStatus;

  @Column({ name: 'dock', type: 'text' })
  dock: string;

  @OneToOne(() => Order, (o) => o.inShipment)
  inOrder: Order;

  @OneToOne(() => Order, (o) => o.outShipment)
  outOrder: Order;

  @Column({ name: 'eta', type: 'timestamp without time zone' })
  eta: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
