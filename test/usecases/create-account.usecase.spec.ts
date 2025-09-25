import { CreateAccountUsecase } from '@/app/usecases/create-account.usecase';
import { AccountsRepository } from '@/app/contracts/repositories/accounts.repository';
import { AccountEntity } from '@/domain/entities/account';

describe('CreateAccountUsecase', () => {
  let usecase: CreateAccountUsecase;
  let mockAccountsRepository: jest.Mocked<AccountsRepository>;

  beforeEach(() => {
    mockAccountsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByIds: jest.fn(),
      updateMany: jest.fn().mockResolvedValue(undefined),
    } as any;

    usecase = new CreateAccountUsecase(mockAccountsRepository);
  });

  describe('execute', () => {
    it('should create an account successfully with generated ID', async () => {
      const accountPayload = {
        name: 'Test Account',
        direction: 'debit' as const,
      };

      const expectedAccount = new AccountEntity(
        expect.any(String),
        'Test Account',
        0,
        'debit',
      );

      mockAccountsRepository.create.mockResolvedValue(expectedAccount);

      const result = await usecase.execute(accountPayload);

      expect(result).toEqual(expectedAccount);
      expect(result.id).toBeDefined();
      expect(result.name).toBe('Test Account');
      expect(result.balance).toBe(0);
      expect(result.direction).toBe('debit');
      expect(mockAccountsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          name: 'Test Account',
          balance: 0,
          direction: 'debit',
        }),
      );
    });

    it('should create an account successfully with provided ID', async () => {
      const accountPayload = {
        id: 'custom-id-123',
        name: 'Custom Account',
        direction: 'credit' as const,
      };

      const expectedAccount = new AccountEntity(
        'custom-id-123',
        'Custom Account',
        0,
        'credit',
      );

      mockAccountsRepository.create.mockResolvedValue(expectedAccount);

      const result = await usecase.execute(accountPayload);

      expect(result).toEqual(expectedAccount);
      expect(result.id).toBe('custom-id-123');
      expect(result.name).toBe('Custom Account');
      expect(result.balance).toBe(0);
      expect(result.direction).toBe('credit');
      expect(mockAccountsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'custom-id-123',
          name: 'Custom Account',
          balance: 0,
          direction: 'credit',
        }),
      );
    });

    it('should create a debit account with zero balance', async () => {
      const accountPayload = {
        name: 'Debit Account',
        direction: 'debit' as const,
      };

      mockAccountsRepository.create.mockImplementation((account) =>
        Promise.resolve(account),
      );

      const result = await usecase.execute(accountPayload);

      expect(result.direction).toBe('debit');
      expect(result.balance).toBe(0);
      expect(mockAccountsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          direction: 'debit',
          balance: 0,
        }),
      );
    });

    it('should create a credit account with zero balance', async () => {
      const accountPayload = {
        name: 'Credit Account',
        direction: 'credit' as const,
      };

      mockAccountsRepository.create.mockImplementation((account) =>
        Promise.resolve(account),
      );

      const result = await usecase.execute(accountPayload);

      expect(result.direction).toBe('credit');
      expect(result.balance).toBe(0);
      expect(mockAccountsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          direction: 'credit',
          balance: 0,
        }),
      );
    });

    it('should generate unique IDs for multiple accounts', async () => {
      const accountPayload1 = {
        name: 'Account 1',
        direction: 'debit' as const,
      };

      const accountPayload2 = {
        name: 'Account 2',
        direction: 'credit' as const,
      };

      mockAccountsRepository.create.mockImplementation((account) =>
        Promise.resolve(account),
      );

      const result1 = await usecase.execute(accountPayload1);
      const result2 = await usecase.execute(accountPayload2);

      expect(result1.id).toBeDefined();
      expect(result2.id).toBeDefined();
      expect(result1.id).not.toBe(result2.id);
    });

    it('should handle repository errors', async () => {
      const accountPayload = {
        name: 'Test Account',
        direction: 'debit' as const,
      };

      const repositoryError = new Error('Database connection failed');
      mockAccountsRepository.create.mockRejectedValue(repositoryError);

      await expect(usecase.execute(accountPayload)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should create account with empty name', async () => {
      const accountPayload = {
        name: '',
        direction: 'debit' as const,
      };

      mockAccountsRepository.create.mockImplementation((account) =>
        Promise.resolve(account),
      );

      const result = await usecase.execute(accountPayload);

      expect(result.name).toBe('');
      expect(result.direction).toBe('debit');
      expect(result.balance).toBe(0);
    });

    it('should create account with long name', async () => {
      const longName = 'A'.repeat(1000);
      const accountPayload = {
        name: longName,
        direction: 'credit' as const,
      };

      mockAccountsRepository.create.mockImplementation((account) =>
        Promise.resolve(account),
      );

      const result = await usecase.execute(accountPayload);

      expect(result.name).toBe(longName);
      expect(result.direction).toBe('credit');
      expect(result.balance).toBe(0);
    });
  });
});
