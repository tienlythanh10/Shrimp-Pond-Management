import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { DeviceCategory } from './device-category.entity';
import { Pond } from './pond.entity';
import { SensorData } from './sensor-data.entity';
import { DeviceSchedule } from './device-schedule.entity';
import { ControlHistory, ControlMode } from './control-history.entity';
import { ThresholdAlert } from './threshold-alert.entity';
import { ThresholdSchedule } from './threshold-schedule.entity';

export enum DeviceType {
    SENSOR_DEVICE = 'sensor-device',
    CONTROL_DEVICE = 'control-device'
}

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string

  @Column()
  description: string

  @Column({
    name: "feed_name",
  })
  feedName: string

  @Column({
    type: "enum",
    enum: DeviceType
  })
  type: DeviceType

  @Column({
    type: "enum",
    enum: ControlMode,
    nullable: true,
  })
  status: ControlMode | null

  @Column({
    name: "category_id",
    type: "uuid"
  })
  categoryId: string

  @OneToOne(() => DeviceCategory)
  @JoinColumn({
    name: "category_id",
    "foreignKeyConstraintName": "FK_Devices_DeviceCategories"
  })
  category: DeviceCategory

  @Column({
    name: "pond_id",
    type: "uuid"
  })
  pondId: string

  @ManyToOne(()=> Pond, (pond) => pond.devices)
  @JoinColumn({
    name: "pond_id",
    "foreignKeyConstraintName": "FK_Devices_Ponds"
  })
  pond: Pond

  @OneToMany(()=> SensorData, (data)=> data.sensor)
  data: SensorData[]

  @OneToMany(() => DeviceSchedule, (schedule) => schedule.device)
  schedules: DeviceSchedule[]

  @OneToMany(() => ControlHistory, (history) => history.device)
  controlHistories: ControlHistory[]
  
  @OneToMany(() => ThresholdAlert, (alert)=> alert.device)
  thresholdAlerts: ThresholdAlert[]

  @OneToMany(() => ThresholdSchedule, (schedule) => schedule.controlDevice)
  controlByThresholds: ThresholdSchedule[]

  @OneToMany(() => ThresholdSchedule, (schedule) => schedule.sensorDevice)
  monitorThresholds: ThresholdSchedule
}
