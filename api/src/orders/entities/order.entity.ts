import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { OrderPriority } from '../enum/order-priority.enum.js';
import { OrderStatus } from '../enum/order-status.enum.js';
import { OrderItem } from './order-items.entity.js';
import { Shipment } from '../../shipments/entities/shipment.entity.js';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pallets', type: 'int' })
  pallets: number;

  @OneToMany(() => OrderItem, (o) => o.order)
  @JoinColumn({ name: 'order_id' })
  items: OrderItem[];

  @OneToOne(() => Shipment)
  @JoinColumn({ name: 'in_shipment_id' })
  inShipment: Relation<Shipment>;

  @OneToOne(() => Shipment)
  @JoinColumn({ name: 'out_shipment_id' })
  outShipment: Relation<Shipment>;

  @Column({ name: 'in_shipment_id', nullable: true })
  inShipmentId?: number;

  @Column({ name: 'out_shipment_id', nullable: true })
  outShipmentId?: number;

  @Column({ name: 'priority', type: 'enum', enum: OrderPriority })
  priority: OrderPriority;

  @Column({ name: 'status', type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  upatedAt: Date;
}
