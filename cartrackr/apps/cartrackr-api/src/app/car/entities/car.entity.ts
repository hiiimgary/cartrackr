import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarModel } from '../resources/car-brand/entities/car-model.entity';
import { AppUser } from '../../app/app-user/entities/app-user.entity';
import { Image } from '../../image/entity/image.entity';
import { Expense } from './expense.entity';
import { Alert } from './alert.entity';
import { BusinessCar } from '../../business-car/entities/business-car.entity';
import { Deadline } from './deadlines.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  licensePlate: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column()
  qrCode: string;

  @ManyToOne(() => CarModel, (carBrand) => carBrand.cars)
  @JoinColumn({ name: 'modelId' })
  model: CarModel;

  @Column()
  modelId: number;

  @Column()
  fuelType: number;

  @ManyToOne(() => AppUser, (user) => user.cars, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: AppUser;

  @Column()
  ownerId: number;

  @OneToMany(() => Image, (image) => image.car)
  @JoinColumn()
  images: Image[];

  @OneToMany(() => Expense, (expense) => expense.car, { onDelete: 'CASCADE' })
  expenses: Expense[];

  @OneToMany(() => Deadline, (deadline) => deadline.car, {
    onDelete: 'CASCADE',
  })
  deadlines: Deadline[];

  @OneToMany(() => Alert, (alert) => alert.car, { onDelete: 'CASCADE' })
  alerts: Alert[];

  @OneToMany(() => BusinessCar, (businessCar) => businessCar.car)
  businesses: BusinessCar[];
}
