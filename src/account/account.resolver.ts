import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { AccountCreateDTO } from './dto/create-account.input';
import { Account } from './entities/account.entity';

@Resolver(() => Account)
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  // This is used to get list of accounts
  @Query(() => [Account], { name: 'getAllAccounts' })
  async findAll() {
    return await this.accountService.findAll();
  }

  @Query(() => Int, { name: 'getCurrentBalance' })
  async getCurrentBalance(
    @Args('account_id', { type: () => String }) account_id: string,
  ) {
    const data = await this.accountService.findOne(account_id);
    return data.balance;
  }

  // This is used to create sample accounts
  @Mutation(() => Account, { name: 'createAccount' })
  async create(@Args('accountInput') account: AccountCreateDTO) {
    return await this.accountService.create(account);
  }
}
