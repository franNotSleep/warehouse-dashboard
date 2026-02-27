import { Injectable, Logger } from '@nestjs/common';
import { ShipmentsService } from './shipments.service.js';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ShipmentsTask {
  private readonly logger = new Logger(ShipmentsTask.name);

  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async markAsDelayed() {
    this.logger.log('Starting markAsDelayed cron job...');

    try {
      await this.shipmentsService.markAsDelayed();
      this.logger.log('markAsDelayed cron job completed successfully.');
    } catch (error: unknown) {
      this.logger.error(
        'Error running markAsDelayed cron job',
        (error as { stack?: string }).stack || error,
      );
    }
  }
}
