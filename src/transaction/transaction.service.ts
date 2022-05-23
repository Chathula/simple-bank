import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import { Repository } from 'typeorm';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(
    createTransactionInput: CreateTransactionInput,
  ): Promise<Transaction> {
    if (createTransactionInput.from === createTransactionInput.to) {
      throw new Error("You can't send money to your own account");
    }

    if (createTransactionInput.amount <= 0) {
      throw new Error('Your amount is lower than 0');
    }

    const fromAccount = await this.accountRepository.findOne({
      account_id: createTransactionInput.from,
    });

    const toAccount = await this.accountRepository.findOne({
      account_id: createTransactionInput.to,
    });

    if (!fromAccount || !toAccount) {
      throw new Error("Couldn't find from or to account");
    }

    const fromAccountRemainingMoney =
      fromAccount.balance - createTransactionInput.amount;

    if (fromAccountRemainingMoney < 0) {
      throw new Error("You don't have enough money in your account to send");
    }

    const transaction = await this.transactionRepository.create(
      createTransactionInput,
    );

    this.accountRepository.update(fromAccount.account_id, {
      balance: fromAccountRemainingMoney,
    });

    this.accountRepository.update(toAccount.account_id, {
      balance: toAccount.balance + createTransactionInput.amount,
    });

    return this.transactionRepository.save(transaction);
  }
}
