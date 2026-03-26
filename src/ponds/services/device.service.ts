import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Device, DeviceType } from 'src/shared/database/entities/device.entity';
import { SensorData } from 'src/shared/database/entities/sensor-data.entity';
import { ControlHistory } from 'src/shared/database/entities/control-history.entity';
import { GetDevicesResponseDto } from '../dto/device.dto';
import { DeviceRepository } from '../repositories/device.repository';

@Injectable()
export class DevicesService {
  constructor(
    private deviceRepository: DeviceRepository,
    private dataSource: DataSource,
  ) {}

  async getDevicesForFrontend(
    pondId?: string,
  ): Promise<GetDevicesResponseDto[]> {
    const devices = await this.deviceRepository.findAllDevice();

    const sensorIds = devices
      .filter((device) => device.type === DeviceType.SENSOR_DEVICE)
      .map((device) => device.id);

    const controlIds = devices
      .filter((device) => device.type === DeviceType.CONTROL_DEVICE)
      .map((device) => device.id);

    const latestSensorDataMap = new Map<
      string,
      {
        value: number;
        updatedAt: string;
      }
    >();

    const latestControlHistoryMap = new Map<
      string,
      {
        updatedAt: string;
      }
    >();

    if (sensorIds.length > 0) {
      const latestSensorRows = await this.dataSource
        .createQueryBuilder(SensorData, 'sd')
        .innerJoin(
          (qb) =>
            qb
              .select('latest.sensor_id', 'sensor_id')
              .addSelect('MAX(latest.created_at)', 'max_created_at')
              .from(SensorData, 'latest')
              .where('latest.sensor_id IN (:...sensorIds)', { sensorIds })
              .groupBy('latest.sensor_id'),
          'last',
          'last.sensor_id = sd.sensor_id AND last.max_created_at = sd.created_at',
        )
        .select([
          'sd.sensorId AS "sensorId"',
          'sd.value AS "value"',
          'sd.createdAt AS "createdAt"',
        ])
        .getRawMany<{
          sensorId: string;
          value: number;
          createdAt: Date;
        }>();

      for (const row of latestSensorRows) {
        latestSensorDataMap.set(row.sensorId, {
          value: Number(row.value),
          updatedAt: new Date(row.createdAt).toISOString(),
        });
      }
    }

    if (controlIds.length > 0) {
      const latestControlRows = await this.dataSource
        .createQueryBuilder(ControlHistory, 'ch')
        .innerJoin(
          (qb) =>
            qb
              .select('latest.device_id', 'device_id')
              .addSelect('MAX(latest.created_at)', 'max_created_at')
              .from(ControlHistory, 'latest')
              .where('latest.device_id IN (:...controlIds)', { controlIds })
              .groupBy('latest.device_id'),
          'last',
          'last.device_id = ch.device_id AND last.max_created_at = ch.created_at',
        )
        .select(['ch.deviceId AS "deviceId"', 'ch.createdAt AS "createdAt"'])
        .getRawMany<{
          deviceId: string;
          createdAt: Date;
        }>();

      for (const row of latestControlRows) {
        latestControlHistoryMap.set(row.deviceId, {
          updatedAt: new Date(row.createdAt).toISOString(),
        });
      }
    }

    return devices.map((device): GetDevicesResponseDto => {
      if (device.type === DeviceType.SENSOR_DEVICE) {
        const latestSensorData = latestSensorDataMap.get(device.id);

        return {
          id: device.id,
          type: DeviceType.SENSOR_DEVICE,
          name: device.name,
          feedName: device.feedName,
          value: latestSensorData?.value ?? null,
          updatedAt: latestSensorData?.updatedAt ?? null,
        };
      }

      const latestControlHistory = latestControlHistoryMap.get(device.id);

      return {
        id: device.id,
        type: DeviceType.CONTROL_DEVICE,
        name: device.name,
        feedName: device.feedName,
        status: device.status,
        updatedAt: latestControlHistory?.updatedAt ?? null,
      };
    });
  }
}
