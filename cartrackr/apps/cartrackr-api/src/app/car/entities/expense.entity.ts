import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExpenseCategory } from '../../expense-category/entities/expense-category.entity';
import { Car } from './car.entity';
import { ServiceEntry } from './service-entry.entity';
import { Refill } from './refill.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ default: 0 })
  price: number;

  @Column()
  title: string;

  @ManyToOne(
    () => ExpenseCategory,
    (expenseCategory) => expenseCategory.expenses,
    { eager: true }
  )
  @JoinColumn()
  expenseCategory: ExpenseCategory;

  @ManyToOne(() => Car, (car) => car.expenses, { onDelete: 'CASCADE' })
  car: Car;

  @OneToOne(() => ServiceEntry, (serviceEntry) => serviceEntry.expense, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  serviceEntry: ServiceEntry;

  @OneToOne(() => Refill, (refill) => refill.expense, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  refill: Refill;

  @Column({ default: true })
  isFinalized: boolean;
}
