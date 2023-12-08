import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { ServiceEntry } from '../../car/entities/service-entry.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  imageName: string;

  @ManyToOne(() => Car, (car) => car.images, { onDelete: 'CASCADE' })
  car: Car;

  @ManyToOne(() => ServiceEntry, (serviceEntry) => serviceEntry.images, {
    onDelete: 'CASCADE',
  })
  serviceEntry: ServiceEntry;
}
