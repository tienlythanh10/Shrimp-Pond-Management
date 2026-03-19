import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('device_categories')
export class DeviceCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string
}
