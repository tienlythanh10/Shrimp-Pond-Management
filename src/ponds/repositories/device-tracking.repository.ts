import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Device } from 'src/shared/database/entities/device.entity';
import { SensorData } from 'src/shared/database/entities/sensor-data.entity';
import { DeviceRepository } from './device.repository';
import {
  ControlHistory,
  ControlMode,
} from 'src/shared/database/entities/control-history.entity';
import { Log } from 'src/shared/database/entities/log.entity';

@Injectable()
export class DeviceTrackingRepository {
  private sensorDataRepository: Repository<SensorData>;
  private controlHistoryRepository: Repository<ControlHistory>;
  private deviceRepository: Repository<Device>;
  private logRepository: Repository<Log>;

  constructor(private dataSource: DataSource) {
    this.sensorDataRepository = this.dataSource.getRepository(SensorData);
    this.controlHistoryRepository =
      this.dataSource.getRepository(ControlHistory);
    this.logRepository = this.dataSource.getRepository(Log);
    this.deviceRepository = this.dataSource.getRepository(Device);
  }

  createSensorData(
    value: number,
    sensorId: string,
    collectedAt: Date = new Date(),
  ) {
    return this.sensorDataRepository.create({
      value: value,
      sensorId: sensorId,
      createdAt: collectedAt,
    });
  }

  saveSensorData(data: SensorData) {
    return this.sensorDataRepository.save(data);
  }

  async saveControlHistory(
    mode: ControlMode,
    deviceId: string,
    collectedAt: Date = new Date(),
  ) {
    const transaction = this.dataSource.createQueryRunner();

    // establish real database connection using our new query runner
    await transaction.connect();

    await transaction.startTransaction();
    try {
      const log = this.logRepository.create({});
      await this.logRepository.save(log);

      const controlHistory = this.controlHistoryRepository.create({
        deviceId: deviceId,
        logId: log.id,
        mode: mode,
        createdAt: collectedAt,
      });
      await this.controlHistoryRepository.save(controlHistory);
      await this.deviceRepository.update(deviceId, {
        status: mode,
      });

      await transaction.commitTransaction();
    } catch (error) {
      await transaction.rollbackTransaction();
    } finally {
      await transaction.release();
    }
  }
}
