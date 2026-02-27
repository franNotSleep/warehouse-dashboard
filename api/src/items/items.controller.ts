import { Controller, Get, Query } from '@nestjs/common';
import { ItemsService } from './items.service.js';

@Controller('api/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(@Query('q') q: string) {
    return this.itemsService.findAll(q);
  }
}
