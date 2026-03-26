import { ControlMode } from 'src/shared/database/entities/control-history.entity';

export class DeviceStatusUpdatedEventDTO {
  deviceId: string;
  deviceName: string;
  feedName: string;
  status: ControlMode;
  value: number;
  updatedAt: string;
}
