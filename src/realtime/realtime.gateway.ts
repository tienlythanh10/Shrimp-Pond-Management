// realtime.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ControlMode } from 'src/shared/database/entities/control-history.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class RealtimeGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('WebSocket gateway initialized');
  }

  emitDeviceStatusUpdated(payload: {
    deviceId: string;
    deviceName: string;
    feedName: string;
    status: ControlMode | null;
    value: number;
    updatedAt: Date;
  }) {
    this.server.emit('device.sensor.updated', payload);
  }

  emitControlHistoryCreated(payload: {
    deviceId: string;
    status: ControlMode;
    updatedAt: Date;
  }) {
    this.server.emit('device.control.updated', payload);
  }
}
