import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Alert } from '../../car/entities/alert.entity';

@Entity()
export class AlertType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => Alert, (alert) => alert.alertType)
  alerts: Alert[];
}
