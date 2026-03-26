// adafruit-mqtt.service.ts
import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { connect, MqttClient } from 'mqtt';
import { DeviceRepository } from '../repositories/device.repository';
import { RabbitProducerService } from 'src/rabbitmq/services/producer.service';

@Injectable()
export class AdafruitMqttService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private readonly logger = new Logger(AdafruitMqttService.name);
  private client: MqttClient | null = null;

  // source of truth in memory for desired subscriptions
  private readonly trackedTopics = new Set<string>();

  constructor(
    private readonly configService: ConfigService,
    private readonly deviceRepository: DeviceRepository,
    private readonly rabbitProducer: RabbitProducerService,
  ) {}

  async onApplicationBootstrap() {
    await this.loadTopicsFromDatabase();
    this.initMqttClient();
  }

  private async loadTopicsFromDatabase() {
    const username = this.configService.get<string>('ADAFRUIT_IO_USERNAME');
    if (!username) throw new Error('Missing ADAFRUIT_IO_USERNAME');

    const devices = await this.deviceRepository.findAllDevice({
      compact: true,
    });

    this.trackedTopics.clear();

    for (const device of devices) {
      const topic = `${username}/feeds/${device.feedName}`;
      this.trackedTopics.add(topic);
    }

    this.logger.log(`Loaded ${this.trackedTopics.size} MQTT topics from DB`);
  }

  private initMqttClient() {
    const username = this.configService.get<string>('ADAFRUIT_IO_USERNAME');
    const password = this.configService.get<string>('ADAFRUIT_IO_KEY');
    const url =
      this.configService.get<string>('ADAFRUIT_IO_URL') ??
      'mqtts://io.adafruit.com:8883';

    if (!username || !password) {
      throw new Error('Missing Adafruit IO credentials');
    }

    this.client = connect(url, {
      username,
      password,
      reconnectPeriod: 5000,
      reconnectOnConnackError: true,
      resubscribe: true,
    });

    this.client.on('connect', async () => {
      this.logger.log('Connected to Adafruit IO');
      await this.subscribeAllTrackedTopics();
    });

    this.client.on('message', async (topic, payload) => {
      const raw = payload.toString();
      this.logger.log(`Message received from ${topic}: ${raw}`);
      const topicToArray = topic.split('/');
      const feedName = topicToArray[topicToArray.length - 1];
      const value = parseFloat(raw);

      this.rabbitProducer.publishCollectedSensorDataToQueue({
        feedName: feedName,
        value: value,
        collectedAt: new Date(),
      });
    });

    this.client.on('reconnect', () => {
      this.logger.warn('Reconnecting to Adafruit IO...');
    });

    this.client.on('error', (error) => {
      this.logger.error(`MQTT error: ${error.message}`, error.stack);
    });

    this.client.on('close', () => {
      this.logger.warn('MQTT connection closed');
    });
  }

  async publishToTopic(
    topic: string,
    value: string | number | boolean,
    options?: {
      qos?: 0 | 1 | 2;
      retain?: boolean;
    },
  ): Promise<void> {
    if (!this.client) {
      throw new Error('MQTT client is not initialized');
    }

    if (!this.client.connected) {
      throw new Error('MQTT client is not connected');
    }

    const payload = String(value);

    await new Promise<void>((resolve, reject) => {
      this.client!.publish(
        topic,
        payload,
        {
          qos: options?.qos ?? 0,
          retain: options?.retain ?? false,
        },
        (err?: Error) => {
          if (err) {
            this.logger.error(
              `Failed to publish to topic "${topic}": ${err.message}`,
            );
            return reject(err);
          }

          this.logger.log(`Published "${payload}" to topic "${topic}"`);
          resolve();
        },
      );
    });
  }

  async publishToFeed(
    feedName: string,
    value: string | number | boolean,
  ): Promise<void> {
    const username = this.configService.get<string>('ADAFRUIT_IO_USERNAME');

    if (!username) {
      throw new Error('Missing ADAFRUIT_IO_USERNAME');
    }

    const topic = `${username}/feeds/${feedName}`;
    await this.publishToTopic(topic, value, { qos: 0, retain: false });
  }

  private async subscribeAllTrackedTopics() {
    if (!this.client || !this.client.connected) return;
    if (this.trackedTopics.size === 0) return;

    const topics = [...this.trackedTopics];

    await new Promise<void>((resolve, reject) => {
      this.client!.subscribe(topics, { qos: 0 }, (err) => {
        if (err) return reject(err);

        this.logger.log(`Subscribed to ${topics.length} topics`);
        resolve();
      });
    });
  }

  //   async addTrackedDeviceFeed(feedName: string) {
  //     const username = this.configService.get<string>('ADAFRUIT_IO_USERNAME');
  //     if (!username) throw new Error('Missing ADAFRUIT_IO_USERNAME');

  //     const topic = `${username}/feeds/${feedName}`;

  //     if (this.trackedTopics.has(topic)) return;

  //     this.trackedTopics.add(topic);

  //     if (this.client?.connected) {
  //       await new Promise<void>((resolve, reject) => {
  //         this.client!.subscribe(topic, { qos: 0 }, (err) => {
  //           if (err) return reject(err);

  //           this.logger.log(`Subscribed to new topic: ${topic}`);
  //           resolve();
  //         });
  //       });
  //     }
  //   }

  //   async removeTrackedDeviceFeed(feedName: string) {
  //     const username = this.configService.get<string>('ADAFRUIT_IO_USERNAME');
  //     if (!username) throw new Error('Missing ADAFRUIT_IO_USERNAME');

  //     const topic = `${username}/feeds/${feedName}`;

  //     this.trackedTopics.delete(topic);

  //     if (this.client?.connected) {
  //       await new Promise<void>((resolve, reject) => {
  //         this.client!.unsubscribe(topic, (err) => {
  //           if (err) return reject(err);

  //           this.logger.log(`Unsubscribed from topic: ${topic}`);
  //           resolve();
  //         });
  //       });
  //     }
  //   }

  //   async reloadTrackedFeedsFromDatabase() {
  //     await this.loadTopicsFromDatabase();

  //     if (this.client?.connected) {
  //       await this.subscribeAllTrackedTopics();
  //     }
  //   }

  async onModuleDestroy() {
    if (!this.client) return;

    await new Promise<void>((resolve) => {
      this.client!.end(false, {}, () => resolve());
    });
  }
}
