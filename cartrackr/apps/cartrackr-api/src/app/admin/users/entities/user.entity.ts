import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserBusiness } from '../../user-business/entities/user-business.entity';
import { AppLoginCredential } from './app-login-credential.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isActivated: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: false })
  isBlocked: boolean;

  @OneToMany(() => UserBusiness, (userBusiness) => userBusiness.user)
  userBusinesses: UserBusiness[];

  @CreateDateColumn()
  registrationDate: Date;
}
