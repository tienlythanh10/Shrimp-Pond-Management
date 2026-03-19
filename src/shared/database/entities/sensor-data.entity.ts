import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Device } from "./device.entity";

@Entity('sensor_data')
export class SensorData {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        type: "float"
    })
    value: number

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => '(CURRENT_TIMESTAMP)',
  })
  createdAt: Date;

  @Column({
    name: "sensor_id",
    type: "uuid"
  })
  sensorId: string

  @ManyToOne(() => Device, (device) => device.data)
  @JoinColumn({
    name: "sensor_id",
    "foreignKeyConstraintName": "FK_SensorData_Devices"
  })
  sensor: Device
}