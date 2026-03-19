import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Device } from "./device.entity";

@Entity("threshold_schedules")
export class ThresholdSchedule {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        name: "device_on_duration_second",
        type: "int"
    })
    deviceOnDurationSecond: number

    @Column({
        name: "safe_range_minimum", 
        type: "float"
    })
    safeRangeMinimum: number

    @Column({
        name: "safe_range_maximum",
        type: "float"
    })
    safeRangeMaximum: number

    @Column({
        name: "control_device_id",
        type: "uuid"
    })
    controlDeviceId: string

    @ManyToOne(() => Device, (device) => device.controlByThresholds)
    @JoinColumn({
        name: "control_device-id",
        foreignKeyConstraintName: "FK_ThresholdSchedule_ControlDevice"
    })
    controlDevice: Device

    @Column({
        name: "sensor_device_id",
        type: "uuid"
    })
    sensorDeviceId: string

    @ManyToOne(() => Device, (device) => device.monitorThresholds)
    @JoinColumn({
        name: "sensor_device_id",
        foreignKeyConstraintName: "FK_ThresholdSchedule_SensorDevice"
    })
    sensorDevice: Device
}