import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'accounts' })
@ObjectType()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  account_id: string;

  @Column()
  @Field(() => Int)
  balance: number;

  @CreateDateColumn({ name: 'created_at' })
  @Field(() => String)
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field(() => String)
  updated_at: Date;
}
