import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Device } from "./device.entity";
import { Log } from "./log.entity";

export enum ThresholdType {
    MIN = "minimum-reach",
    MAX = "maximum-reach"
} 

@Entity('threshold_alerts')
export class ThresholdAlert {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        type: "float"
    })
    value: number

    @Column({
        name: "threshold_type",
        "type": "enum",
        enum: ThresholdType
    })
    thresholdType: ThresholdType

    @Column({
        name: "device_id",
        type: "uuid"
    })
    deviceId: string

    @ManyToOne(()=> Device, (device) => device.thresholdAlerts)
    @JoinColumn({
        name: "device_id",
        foreignKeyConstraintName: "FK_ThresholdAlert_Devices"
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
        foreignKeyConstraintName: "FK_ThresholdAlert_Log"
    })
        log: Log
}