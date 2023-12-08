import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserBusiness } from '../../admin/user-business/entities/user-business.entity';
import { Location } from '../../location/entity/location.entity';
import { ContactInfo } from './contact-info.entity';
import { BusinessCar } from '../../business-car/entities/business-car.entity';
import { ServiceEntry } from '../../car/entities/service-entry.entity';

@Entity()
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UserBusiness, (userBusiness) => userBusiness.business)
  userBusinesses: UserBusiness[];

  @OneToOne(() => Location, (location) => location.business, { cascade: true })
  @JoinColumn()
  location: Location;

  @OneToOne(() => ContactInfo, (contactInfo) => contactInfo.business, {
    cascade: true,
  })
  @JoinColumn()
  contactInfo: ContactInfo;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => BusinessCar, (businessCar) => businessCar.business)
  cars: BusinessCar[];

  @OneToMany(() => ServiceEntry, (serviceEntry) => serviceEntry.business)
  serviceEntries: ServiceEntry[];
}
