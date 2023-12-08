import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { Business } from '../../business/entities/business.entity';

@Entity()
export class BusinessCar {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Car, (car) => car.businesses, { onDelete: 'CASCADE' })
  car: Car;

  @ManyToOne(() => Business, (business) => business.cars, {
    onDelete: 'CASCADE',
  })
  business: Business;

  @Column({ default: false })
  isAccessGranted: boolean;
}
