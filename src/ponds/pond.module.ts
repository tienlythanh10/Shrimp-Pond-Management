import { Module } from '@nestjs/common';
import { TypeOrmModule } from 'src/shared/database/typeorm.module';
import { AdafruitMqttService } from './services/mqtt.service';
import { DeviceRepository } from './repositories/device.repository';
import { RabbitProducerService } from 'src/rabbitmq/services/producer.service';
import { CustomRabbitModule } from 'src/rabbitmq/rabbitmq.module';
import { DeviceController } from './controllers/device.controller';
import { DevicesService } from './services/device.service';

@Module({
  imports: [TypeOrmModule, CustomRabbitModule],
  controllers: [DeviceController],
  providers: [
    AdafruitMqttService,
    DevicesService,
    DeviceRepository,
    RabbitProducerService,
  ],
})
export class PondModule {}
