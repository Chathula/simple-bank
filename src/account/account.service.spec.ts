import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';

describe('AccountService', () => {
  let service: AccountService;
  let accountRepository: Repository<Account>;

  const ACCOUNT_REPOSITORY_TOKEN = getRepositoryToken(Account);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: ACCOUNT_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    accountRepository = module.get<Repository<Account>>(
      ACCOUNT_REPOSITORY_TOKEN,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('accountRepository should be defined', () => {
    expect(accountRepository).toBeDefined();
  });

  it('call find method when call findAll in service', async () => {
    await service.findAll();
    expect(accountRepository.find).toBeCalledTimes(1);
  });

  it('call findOne method when call findOne in service', async () => {
    await service.findOne('foo');
    expect(accountRepository.findOne).toBeCalledTimes(1);
    expect(accountRepository.findOne).toBeCalledWith({ account_id: 'foo' });
  });

  it('call create and save methods when call create in service', async () => {
    await service.create({ balance: 100 });
    expect(accountRepository.create).toBeCalledTimes(1);
    expect(accountRepository.save).toBeCalledTimes(1);
    expect(accountRepository.create).toBeCalledWith({ balance: 100 });
  });
});
