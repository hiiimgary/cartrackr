import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from './business.entity';

@Entity()
export class ContactInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  phone: string;

  @OneToOne(() => Business, (business) => business.location, {
    onDelete: 'CASCADE',
  })
  business: Business;
}
