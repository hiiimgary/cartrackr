import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { RefillStation } from '../../refill-station/entities/refill-station.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  country: string;

  @Column()
  zipCode: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  streetNumber: string;

  @OneToOne(() => Business, (business) => business.location, {
    onDelete: 'CASCADE',
  })
  business: Business;

  @OneToOne(() => RefillStation, (refillStation) => refillStation.location, {
    onDelete: 'CASCADE',
  })
  refillStation: RefillStation;
}
