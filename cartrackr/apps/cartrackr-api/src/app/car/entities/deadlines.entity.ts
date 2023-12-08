import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Car } from './car.entity';

@Entity()
export class Deadline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  deadline: Date;

  @Column({ default: false })
  isDone: boolean;

  @ManyToOne(() => Car, (car) => car.deadlines, { onDelete: 'CASCADE' })
  car: Car;
}
