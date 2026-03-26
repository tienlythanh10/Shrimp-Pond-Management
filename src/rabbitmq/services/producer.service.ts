import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CollectedSensorDataDTO } from '../dto/sensor.dto';

@Injectable()
export class RabbitProducerService {
  private exchange: string;
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
  ) {
    this.exchange = `${this.configService.get('NODE_ENV')}.${this.configService.get('RMQ_EXCHANGE') || 'ex.shrimp-farm.events.v1'}`;
  }

  async publishCollectedSensorDataToQueue(message: CollectedSensorDataDTO) {
    await this.amqpConnection.publish(
      this.exchange,
      'pond.sensor.data.collected.v1',
      message,
    );
  }
}
