import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Expense } from './expense.entity';

@Entity()
export class Refill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mileage: number;

  @Column()
  amount: number;

  @Column()
  isFull: boolean;

  @OneToOne(() => Expense, (expense) => expense.refill, { onDelete: 'CASCADE' })
  expense: Expense;
}
