import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("logs")
export class Log {
    @PrimaryGeneratedColumn('uuid')
    id: string

      @Column({
        name: 'created_at',
        type: 'timestamp',
        default: () => '(CURRENT_TIMESTAMP)',
      })
      createdAt: Date;
    
      @Column({
        name: "is_read",
        default: false
      })
      isRead: boolean
}