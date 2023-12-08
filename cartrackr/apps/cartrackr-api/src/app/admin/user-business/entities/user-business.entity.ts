import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Business } from '../../../business/entities/business.entity';
import { BusinessRole } from '@cartrackr/cartrackr-shared';
import { AppLoginCredential } from '../../users/entities/app-login-credential.entity';
@Entity()
export class UserBusiness {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: BusinessRole })
  permission: BusinessRole;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.userBusinesses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(
    () => AppLoginCredential,
    (appLoginCredential) => appLoginCredential.userBusiness
  )
  appLoginCredential: AppLoginCredential;

  @Column()
  businessId: number;

  @ManyToOne(() => Business, (business) => business.userBusinesses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'businessId' })
  business: Business;
}
