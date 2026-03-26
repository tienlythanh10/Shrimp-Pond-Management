import { DeviceType } from 'src/shared/database/entities/device.entity';

export type SensorDeviceResponseDto = {
  id: string;
  type: DeviceType;
  name: string;
  feedName: string;
  value: number | null;
  updatedAt: string | null;
};

export type ControlDeviceResponseDto = {
  id: string;
  type: DeviceType;
  name: string;
  feedName: string;
  status: string | null;
  updatedAt: string | null;
};

export type GetDevicesResponseDto =
  | SensorDeviceResponseDto
  | ControlDeviceResponseDto;
