import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../../image/entity/image.entity';
import { Expense } from './expense.entity';
import { Business } from '../../business/entities/business.entity';

@Entity()
export class ServiceEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Image, (image) => image.serviceEntry)
  images: Image[];

  @OneToOne(() => Expense, (expense) => expense.serviceEntry, {
    onDelete: 'CASCADE',
  })
  expense: Expense;

  @ManyToOne(() => Business, (business) => business.serviceEntries, {
    cascade: true,
  })
  @JoinColumn()
  business: Business;

  @Column()
  businessId: number;

  @Column({ type: 'longtext', nullable: true })
  description: string;
}
