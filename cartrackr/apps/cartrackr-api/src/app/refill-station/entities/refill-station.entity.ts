import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from '../../location/entity/location.entity';

@Entity()
export class RefillStation {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Location, (location) => location.refillStation, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  location: Location;

  @Column()
  name: string;
}
