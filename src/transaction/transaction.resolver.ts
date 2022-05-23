import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => Transaction, { name: 'makeTransaction' })
  async createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ): Promise<Transaction> {
    return await this.transactionService.create(createTransactionInput);
  }
}
