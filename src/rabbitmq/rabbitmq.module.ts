import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitProducerService } from './services/producer.service';
import { RabbitConsumerService } from './services/consumer.service';
import { DeviceRepository } from 'src/ponds/repositories/device.repository';
import { TypeOrmModule } from 'src/shared/database/typeorm.module';
import { DeviceTrackingRepository } from 'src/ponds/repositories/device-tracking.repository';
import { RealtimeGateway } from 'src/realtime/realtime.gateway';

@Module({
  imports: [
    TypeOrmModule,
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        exchanges: [
          {
            name: `${configService.get<string>('NODE_ENV')}.${configService.get<string>('RMQ_EXCHANGE') || 'ex.shrimp-farm.events.v1'}`,
            type: 'topic',
          },
        ],
        uri: `amqps://${configService.get<string>('RMQ_USER')}:${configService.get<string>('RMQ_PASSWORD')}@${configService.get<string>('RMQ_HOST')}/${configService.get<string>('RMQ_USER')}`,
        connectionInitOptions: { wait: false },
        queues: [
          {
            name: `${configService.get<string>('NODE_ENV')}.q.sensor-data.collected.v1`,
            exchange: `${configService.get<string>('NODE_ENV')}.${configService.get<string>('RMQ_EXCHANGE') || 'ex.shrimp-farm.events.v1'}`,
            createQueueIfNotExists: true,
            routingKey: 'pond.sensor.data.collected.v1',
            options: {
              noAck: false,
              durable: true,
            },
          },
          {
            name: `${configService.get<string>('NODE_ENV')}.q.threshold-check.created.v1`,
            exchange: `${configService.get<string>('NODE_ENV')}.${configService.get<string>('RMQ_EXCHANGE') || 'ex.shrimp-farm.events.v1'}`,
            createQueueIfNotExists: true,
            routingKey: 'pond.sensor.data.collected.v1',
            options: {
              noAck: false,
              durable: true,
            },
          },
        ],
      }),
    }),
    CustomRabbitModule,
  ],
  providers: [
    RabbitProducerService,
    RabbitConsumerService,
    DeviceRepository,
    RealtimeGateway,
    DeviceTrackingRepository,
  ],
  exports: [RabbitMQModule],
})
export class CustomRabbitModule {}
