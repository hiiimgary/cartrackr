import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AppUser } from './app-user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('longtext')
  token: string;

  @ManyToOne(() => AppUser, (user) => user.refreshTokens)
  user: AppUser;
}
