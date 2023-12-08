import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserBusiness } from '../../user-business/entities/user-business.entity';

@Entity()
export class AppLoginCredential {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('longtext')
  token: string;

  @OneToOne(() => UserBusiness, (user) => user.appLoginCredential, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  userBusiness: UserBusiness;

  @Column()
  userBusinessId: number;
}
