import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import {  Device } from "./device.entity";
import { Log } from "./log.entity";


export enum ControlMode {
    ON = "on",
    OFF = "off"
}


@Entity('control_histories')
export class ControlHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        type: "enum",
        "enum": ControlMode
    })
    mode: ControlMode;

    @Column({
        name: "device_id",
        type: "uuid"        
    })
    deviceId: string

    @ManyToOne(()=> Device, (device) => device.controlHistories)
    @JoinColumn({
        name: "device_id",
        foreignKeyConstraintName: "FK_ControlHistory_Devices"
    })
    device: Device


    @Column({
        name: "log_id",
        type: "uuid"
    })
    logId: string

    @OneToOne(()=>Log)
    @JoinColumn({
        name: "log_id",
        foreignKeyConstraintName: "FK_ControlHistory_Log"
    })
    log: Log
}