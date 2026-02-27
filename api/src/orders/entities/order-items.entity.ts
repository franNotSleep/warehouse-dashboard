import { Item } from '../../items/items.entity.js';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity.js';

@Entity({ name: 'orders_items' })
export class OrderItem {
  @PrimaryColumn({ name: 'order_id' })
  orderId: number;

  @PrimaryColumn({ name: 'item_id' })
  itemId: number;

  @ManyToOne(() => Item, (i) => i.orders)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @ManyToOne(() => Order, (o) => o.items)
  @JoinColumn({ name: 'order_id' })
  order: Relation<Order>;

  @Column({ name: 'units', type: 'int' })
  units: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  upatedAt: Date;
}
