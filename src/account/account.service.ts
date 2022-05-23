import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountCreateDTO } from './dto/create-account.input';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find();
  }

  async findOne(account_id: string): Promise<Account> {
    return await this.accountRepository.findOne({ account_id });
  }

  async create(account: AccountCreateDTO): Promise<Account> {
    const result = await this.accountRepository.create({
      balance: account.balance,
    });

    return this.accountRepository.save(result);
  }
}
