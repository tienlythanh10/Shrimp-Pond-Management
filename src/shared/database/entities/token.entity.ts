import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';


@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => '(CURRENT_TIMESTAMP)',
  })
  createdAt: Date;

    @Column({
    name: 'expired_at',
    type: 'timestamp',
  })
  expiredAt: Date;

  @Column({
    name: "is_revoked",
    default: false
  })
  isRevoked: boolean

  @Column({
    type: "timestamp",
    name: "used_at",
    nullable: true,
    default: null
  })
  usedAt: Date | null


  @Column({
    name: "user_id",
    type: "uuid"
  })
  userId: string

  @ManyToOne(()=> User, (user) => user.tokens)
  @JoinColumn({
    name: "user_id",
    "foreignKeyConstraintName": "FK_Tokens_Users"
  })
  user: User
}