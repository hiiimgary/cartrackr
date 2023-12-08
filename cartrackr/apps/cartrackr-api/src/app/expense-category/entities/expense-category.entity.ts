import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expense } from '../../car/entities/expense.entity';

@Entity()
export class ExpenseCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn({ unique: true })
  slug: string;

  @Column()
  name: string;

  @OneToMany(() => Expense, (expense) => expense.expenseCategory)
  expenses: Expense[];
}
