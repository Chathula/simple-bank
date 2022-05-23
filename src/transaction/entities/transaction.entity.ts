import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'transactions' })
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  transaction_id: string;

  @Column()
  @Field(() => Int)
  amount: number;

  @Column()
  @Field(() => String)
  from: string;

  @Column()
  @Field(() => String)
  to: string;

  @CreateDateColumn({ name: 'created_at' })
  @Field(() => String)
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field(() => String)
  updated_at: Date;
}
