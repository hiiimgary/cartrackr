import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CarBrand } from '../../car-brand/entities/car-brand.entity';
import { CarModelCategory } from './car-model-category';
import { Car } from '../../../entities/car.entity';

@Entity()
export class CarModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => CarBrand, (carBrand) => carBrand.models)
  brand?: CarBrand;

  @ManyToOne(() => CarModelCategory, (carModel) => carModel.models, {
    nullable: true,
  })
  category?: CarModelCategory;

  @OneToMany(() => Car, (car) => car.model)
  cars: Car[];
}
