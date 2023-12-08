import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CarBrand } from './car-brand.entity';
import { CarModel } from './car-model.entity';

@Entity()
export class CarModelCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => CarBrand, (carBrand) => carBrand.models)
  @JoinColumn()
  brand: CarBrand;

  @Column()
  brandId: number;

  @OneToMany(() => CarModel, (model) => model.category, {
    cascade: true,
    eager: true,
  })
  models: CarModel[];
}
