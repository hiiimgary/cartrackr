import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { Car } from '../../../car/entities/car.entity';
import { Alert } from '../../../car/entities/alert.entity';
import { NotificationToken } from './notification-token.entity';

@Entity()
export class AppUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Car, (car) => car.owner)
  cars: Car[];

  @OneToMany(
    () => NotificationToken,
    (notificationToken) => notificationToken.user
  )
  fcmTokens: NotificationToken[];
}
