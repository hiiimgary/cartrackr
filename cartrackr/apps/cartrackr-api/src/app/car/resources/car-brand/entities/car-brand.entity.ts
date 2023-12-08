import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CarModel } from './car-model.entity';
import { CarModelCategory } from './car-model-category';

@Entity()
export class CarBrand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => CarModelCategory, (carModel) => carModel.brand, {
    cascade: true,
    eager: true,
  })
  categories: CarModelCategory[];

  @OneToMany(() => CarModel, (carModel) => carModel.brand, {
    cascade: true,
    eager: true,
  })
  models: CarModel[];
}
