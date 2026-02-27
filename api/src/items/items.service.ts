import { Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './items.entity.js';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  findAll(q: string = '') {
    return this.itemsRepository.find({
      where: [
        {
          name: ILike(`%${q}%`),
        },
        { sku: q },
      ],
      take: 20,
    });
  }
}
