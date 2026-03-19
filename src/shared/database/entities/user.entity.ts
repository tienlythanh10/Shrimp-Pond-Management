import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Token } from './token.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    "name": "first_name"
  })
  firstName: string
  
    @Column({
    "name": "last_name"
  })
  lastName: string

  @Column({
    name: "phone_number",
    type: "varchar",
    "length": 10,
    unique: true
    })
  phoneNumber: string

  
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => '(CURRENT_TIMESTAMP)',
  })
  createdAt: Date;

  @OneToMany(()=>Token, (token) => token.user)
  tokens: Token[]
}