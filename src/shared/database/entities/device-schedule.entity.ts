import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Device } from "./device.entity";

export enum DayOfWeek {
    MONDAY = 0,
    TUESDAY = 1,
    WEDNESDAY = 2,
    THURSDAY = 3,
    FRIDAY = 4,
    SATURDAY = 5,
    SUNDAY = 6
}

@Entity('device_schedules')
export class DeviceSchedule {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        name: "start_at",
        type: "int"
    })
    startAt: number

    @Column({
        name: "duration_second",
        type: "int"
    })
    durationSecond: number

    @Column({
        name: "day_of_week",
        type: "enum",
        enum: DayOfWeek
    })
    dayOfWeek: DayOfWeek

    @Column({
        "name": "device_id",
        type: "uuid"
    })
    deviceId: string

    @ManyToOne(()=> Device, (device) => device.schedules)
    @JoinColumn({
        name: "device_id",
        "foreignKeyConstraintName": "FK_DeviceSchedules_Devices"
    })
    device: Device
}