import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth.js';
import { ShipmentsModule } from './shipments/shipments.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { ItemsModule } from './items/items.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
    DatabaseModule,
    AuthModule.forRoot({ auth }),
    ShipmentsModule,
    OrdersModule,
    ItemsModule,
    DashboardModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  providers: [],
})
export class AppModule {}
