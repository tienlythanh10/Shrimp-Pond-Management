import { RabbitSubscribe, Nack } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { CollectedSensorDataDTO } from '../dto/sensor.dto';
import { DeviceRepository } from 'src/ponds/repositories/device.repository';
import { DeviceType } from 'src/shared/database/entities/device.entity';
import { DeviceTrackingRepository } from 'src/ponds/repositories/device-tracking.repository';
import { ControlMode } from 'src/shared/database/entities/control-history.entity';
import { RealtimeGateway } from 'src/realtime/realtime.gateway';

@Injectable()
export class RabbitConsumerService {
  constructor(
    private deviceRepository: DeviceRepository,
    private deviceTrackingRepository: DeviceTrackingRepository,
    private realtimeGateway: RealtimeGateway,
  ) {}

  @RabbitSubscribe({
    exchange: `${process.env.NODE_ENV}.${process.env.RMQ_EXCHANGE || 'ex.shrimp-farm.events.v1'}`,
    routingKey: ['pond.sensor.data.collected.v1'],
    queue: `${process.env.NODE_ENV}.q.sensor-data.collected.v1`,
  })
  public async handleSensorDataQueue(message: CollectedSensorDataDTO) {
    console.log(message);
    const device = await this.deviceRepository.findByFeedName(message.feedName);

    if (device == null) {
      return;
    }

    if (device.type == DeviceType.SENSOR_DEVICE) {
      console.log('Writing sensor data to database');
      const data = this.deviceTrackingRepository.createSensorData(
        message.value,
        device.id,
        message.collectedAt,
      );
      await this.deviceTrackingRepository.saveSensorData(data);
      this.realtimeGateway.emitDeviceStatusUpdated({
        deviceId: device.id,
        deviceName: device.name,
        feedName: device.feedName,
        status: null,
        value: message.value,
        updatedAt: message.collectedAt,
      });
      return;
    }

    const mode = message.value == 0 ? ControlMode.OFF : ControlMode.ON;

    /*
     * Duplicate message
     */
    if (mode == device.status) {
      return;
    }

    console.log('Writing control history to database');
    await this.deviceTrackingRepository.saveControlHistory(
      mode,
      device.id,
      message.collectedAt,
    );
    this.realtimeGateway.emitControlHistoryCreated({
      deviceId: device.id,
      status: mode,
      updatedAt: message.collectedAt,
    });
  }
}
