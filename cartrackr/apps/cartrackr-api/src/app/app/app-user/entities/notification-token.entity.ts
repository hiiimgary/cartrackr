import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AppUser } from './app-user.entity';

@Entity()
export class NotificationToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  token: string;

  @ManyToOne(() => AppUser, (user) => user.fcmTokens, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  user: AppUser;
}
