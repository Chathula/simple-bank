import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from '../account/entities/account.entity';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let accountRepository: Repository<Account>;
  let transactionRepository: Repository<Transaction>;

  const ACCOUNT_REPOSITORY_TOKEN = getRepositoryToken(Account);
  const Transaction_REPOSITORY_TOKEN = getRepositoryToken(Transaction);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: ACCOUNT_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: Transaction_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<TransactionService>(TransactionService);
    accountRepository = module.get<Repository<Account>>(
      ACCOUNT_REPOSITORY_TOKEN,
    );
    transactionRepository = module.get<Repository<Transaction>>(
      Transaction_REPOSITORY_TOKEN,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('accountRepository should be defined', () => {
    expect(accountRepository).toBeDefined();
  });

  it('transactionRepository should be defined', () => {
    expect(transactionRepository).toBeDefined();
  });

  it('should throw an error if to and from inputs are equal when calling create method', async () => {
    await expect(
      service.create({ amount: 10, from: 'foo', to: 'foo' }),
    ).rejects.toThrow("You can't send money to your own account");
  });

  it('should throw an error if amount is less than or equals to 0 when calling create method', async () => {
    await expect(
      service.create({ amount: -10, from: 'foo', to: 'bar' }),
    ).rejects.toThrow('Your amount is lower than 0');
  });

  it('should throw an error if one of account can not be found when calling create method', async () => {
    jest.spyOn(accountRepository, 'findOne').mockResolvedValue(null);
    await expect(
      service.create({ amount: 100, from: 'foo', to: 'bar' }),
    ).rejects.toThrow("Couldn't find from or to account");
  });

  it("should throw an error if from account doesn't have enough money when calling create method", async () => {
    jest
      .spyOn(accountRepository, 'findOne')
      .mockResolvedValueOnce({
        account_id: 'foo',
        balance: 10,
        created_at: new Date('2020-10-10'),
        updated_at: new Date('2020-10-10'),
      })
      .mockResolvedValue({
        account_id: 'foo',
        balance: 1000,
        created_at: new Date('2020-10-10'),
        updated_at: new Date('2020-10-10'),
      });
    await expect(
      service.create({ amount: 100, from: 'foo', to: 'bar' }),
    ).rejects.toThrow("You don't have enough money in your account to send");
  });

  it('should create new transaction and update account balance when calling create method', async () => {
    jest
      .spyOn(accountRepository, 'findOne')
      .mockResolvedValueOnce({
        account_id: 'foo',
        balance: 1000,
        created_at: new Date('2020-10-10'),
        updated_at: new Date('2020-10-10'),
      })
      .mockResolvedValue({
        account_id: 'bar',
        balance: 2000,
        created_at: new Date('2020-10-10'),
        updated_at: new Date('2020-10-10'),
      });
    await service.create({ amount: 100, from: 'foo', to: 'bar' });
    expect(accountRepository.findOne).toBeCalledTimes(2);
    expect(accountRepository.update).toBeCalledTimes(2);
    expect(transactionRepository.create).toBeCalledTimes(1);
    expect(transactionRepository.save).toBeCalledTimes(1);
    expect(accountRepository.findOne).nthCalledWith(1, { account_id: 'foo' });
    expect(accountRepository.findOne).nthCalledWith(2, { account_id: 'bar' });
    expect(accountRepository.update).nthCalledWith(1, 'foo', { balance: 900 });
    expect(accountRepository.update).nthCalledWith(2, 'bar', { balance: 2100 });
    expect(transactionRepository.create).toBeCalledWith({
      amount: 100,
      from: 'foo',
      to: 'bar',
    });
  });
});
