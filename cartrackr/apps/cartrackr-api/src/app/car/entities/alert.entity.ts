import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AlertType } from '../../alert/entities/alert-type.entity';
import { Car } from './car.entity';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AlertType, (alertType) => alertType.alerts, {
    onDelete: 'CASCADE',
  })
  alertType: AlertType;

  @ManyToOne(() => Car, (car) => car.alerts, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  car: Car;

  @Column({ nullable: true })
  licensePlate: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isResolved: boolean;

  @Column({ default: false })
  isArchived: boolean;
}
