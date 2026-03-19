import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Device } from './device.entity';


@Entity('ponds')
export class Pond {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string

  @Column()
  description: string

  @OneToMany(()=> Device, (device) => device.pond)
  devices: Device[]
}