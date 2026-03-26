import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { DeviceRepository } from '../repositories/device.repository';
import { ControlMode } from 'src/shared/database/entities/control-history.entity';
import { AdafruitMqttService } from '../services/mqtt.service';
import { DevicesService } from '../services/device.service';

@Controller('api/v1/devices')
export class DeviceController {
  constructor(
    private deviceService: DevicesService,
    private mqttService: AdafruitMqttService,
    private deviceRepository: DeviceRepository,
  ) {}

  @Get('')
  async getDevices(@Res() res: Response) {
    const devices = await this.deviceService.getDevicesForFrontend();

    res.status(200).json(devices);
  }

  @Post(':deviceId/control')
  async updateControlDeviceStatus(
    @Param('deviceId') deviceId: string,
    @Body()
    body: {
      status: ControlMode;
    },
    @Res() res: Response,
  ) {
    const device = await this.deviceRepository.findById(deviceId);

    if (device == null) {
      return res.status(404).json({
        message: 'Device not found',
        success: false,
      });
    }

    if (device.status == body.status) {
      return res.status(200).json({
        success: true,
      });
    }

    await this.mqttService.publishToFeed(
      device.feedName,
      body.status === ControlMode.ON ? 1 : 0,
    );
    res.status(200).json({
      success: true,
    });
  }
}
