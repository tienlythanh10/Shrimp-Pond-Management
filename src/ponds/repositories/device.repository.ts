import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Device } from 'src/shared/database/entities/device.entity';
import { ControlMode } from 'src/shared/database/entities/control-history.entity';

@Injectable()
export class DeviceRepository {
  private deviceRepository: Repository<Device>;

  constructor(private dataSource: DataSource) {
    this.deviceRepository = this.dataSource.getRepository(Device);
  }

  async findAllDevice(options?: { compact: boolean }): Promise<Device[]> {
    if (options?.compact == true) {
      return await this.deviceRepository.find({
        select: ['id', 'feedName'],
      });
    }
    return await this.deviceRepository.find({});
  }

  async findById(deviceId: string): Promise<Device | null> {
    return await this.deviceRepository.findOne({
      where: {
        id: deviceId,
      },
    });
  }

  async findByFeedName(feedName: string): Promise<Device | null> {
    return await this.deviceRepository.findOne({
      where: {
        feedName,
      },
    });
  }
}
