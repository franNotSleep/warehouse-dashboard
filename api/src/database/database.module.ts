import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { DatabaseConfiguration } from '../config/database.config.js';
import { __dirname } from '../config/common.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<DatabaseConfiguration>('database');
        return {
          type: 'postgres',
          host: dbConfig?.host,
          port: dbConfig?.port,
          username: dbConfig?.user,
          password: dbConfig?.password,
          database: dbConfig?.database,
          entities: [__dirname + '/../**/*.entity.ts'],
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
