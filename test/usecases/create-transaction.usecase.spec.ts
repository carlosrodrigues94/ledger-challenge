import { CreateTransactionUsecase } from '@/app/usecases/create-transaction.usecase';
import { TransactionsRepository } from '@/app/contracts/repositories/transactions.repository';
import { AccountsRepository } from '@/app/contracts/repositories/accounts.repository';
import { EntryRepository } from '@/app/contracts/repositories/entry.repository';
import { AccountEntity } from '@/domain/entities/account';
import { EntryEntity } from '@/domain/entities/entry';
import { ApplicationException } from '@/app/exceptions/application.exception';

describe('CreateTransactionUsecase', () => {
  let usecase: CreateTransactionUsecase;
  let mockTransactionsRepository: jest.Mocked<TransactionsRepository>;
  let mockAccountsRepository: jest.Mocked<AccountsRepository>;
  let mockEntryRepository: jest.Mocked<EntryRepository>;

  beforeEach(() => {
    mockTransactionsRepository = {
      create: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
    } as any;

    mockAccountsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByIds: jest.fn(),
      updateMany: jest.fn().mockResolvedValue(undefined),
    } as any;

    mockEntryRepository = {
      createMany: jest.fn(),
    } as any;

    usecase = new CreateTransactionUsecase(
      mockTransactionsRepository,
      mockAccountsRepository,
      mockEntryRepository,
    );
  });

  describe('execute', () => {
    it('should create a balanced transaction successfully', async () => {
      const account1 = new AccountEntity('acc1', 'Account 1', 100, 'debit');
      const account2 = new AccountEntity('acc2', 'Account 2', 0, 'credit');

      const entries = [
        new EntryEntity('entry1', 'debit', 50, 'acc1'),
        new EntryEntity('entry2', 'credit', 50, 'acc2'),
      ];

      const transactionPayload = {
        name: 'Test Transaction',
        entries,
      };

      mockAccountsRepository.findByIds.mockResolvedValue([account1, account2]);
      mockTransactionsRepository.create.mockResolvedValue();
      mockAccountsRepository.updateMany.mockResolvedValue();
      mockEntryRepository.createMany.mockResolvedValue(entries);

      const result = await usecase.execute(transactionPayload);

      expect(result).toEqual({
        id: expect.any(String),
        name: 'Test Transaction',
        entries,
      });
      expect(mockTransactionsRepository.create).toHaveBeenCalledWith({
        ...transactionPayload,
        id: expect.any(String),
      });
      expect(mockAccountsRepository.updateMany).toHaveBeenCalled();
      expect(mockEntryRepository.createMany).toHaveBeenCalledWith(entries);
    });

    it('should throw error when transaction is not balanced', async () => {
      const entries = [
        new EntryEntity('entry1', 'debit', 50, 'acc1'),
        new EntryEntity('entry2', 'credit', 30, 'acc2'),
      ];

      const transactionPayload = {
        name: 'Unbalanced Transaction',
        entries,
      };

      await expect(usecase.execute(transactionPayload)).rejects.toThrow(
        new ApplicationException('Transaction not balanced', 400),
      );
    });

    it('should throw error when transaction has only debits', async () => {
      const entries = [
        new EntryEntity('entry1', 'debit', 50, 'acc1'),
        new EntryEntity('entry2', 'debit', 50, 'acc2'),
      ];

      const transactionPayload = {
        name: 'Only Debits Transaction',
        entries,
      };

      await expect(usecase.execute(transactionPayload)).rejects.toThrow(
        new ApplicationException('Transaction not balanced', 400),
      );
    });

    it('should throw error when transaction has only credits', async () => {
      const entries = [
        new EntryEntity('entry1', 'credit', 50, 'acc1'),
        new EntryEntity('entry2', 'credit', 50, 'acc2'),
      ];

      const transactionPayload = {
        name: 'Only Credits Transaction',
        entries,
      };

      await expect(usecase.execute(transactionPayload)).rejects.toThrow(
        new ApplicationException('Transaction not balanced', 400),
      );
    });

    it('should throw error when transaction has both debit and credit but unbalanced amounts', async () => {
      const entries = [
        new EntryEntity('entry1', 'debit', 50, 'acc1'),
        new EntryEntity('entry2', 'credit', 30, 'acc2'),
      ];

      const transactionPayload = {
        name: 'Unbalanced Mixed Transaction',
        entries,
      };

      await expect(usecase.execute(transactionPayload)).rejects.toThrow(
        new ApplicationException('Transaction not balanced', 400),
      );
    });

    it('should throw error when account is not found', async () => {
      const entries = [
        new EntryEntity('entry1', 'debit', 50, 'acc1'),
        new EntryEntity('entry2', 'credit', 50, 'acc2'),
      ];

      const transactionPayload = {
        name: 'Transaction with Missing Account',
        entries,
      };

      mockAccountsRepository.findByIds.mockResolvedValue([]);

      await expect(usecase.execute(transactionPayload)).rejects.toThrow(
        new ApplicationException('Account not found', 404),
      );
    });

    it('should throw error when insufficient balance for opposite direction', async () => {
      const account1 = new AccountEntity('acc1', 'Account 1', 30, 'debit');
      const account2 = new AccountEntity('acc2', 'Account 2', 0, 'credit');

      const entries = [
        new EntryEntity('entry1', 'credit', 50, 'acc1'),
        new EntryEntity('entry2', 'debit', 50, 'acc2'),
      ];

      const transactionPayload = {
        name: 'Insufficient Balance Transaction',
        entries,
      };

      mockAccountsRepository.findByIds.mockResolvedValue([account1, account2]);

      await expect(usecase.execute(transactionPayload)).rejects.toThrow(
        new ApplicationException('Insufficient balance', 400),
      );
    });

    it('should throw error when account has multiple entries with same direction', async () => {
      const entries = [
        new EntryEntity('entry1', 'debit', 30, 'acc1'),
        new EntryEntity('entry2', 'debit', 20, 'acc1'),
        new EntryEntity('entry3', 'credit', 50, 'acc2'),
      ];

      const transactionPayload = {
        name: 'Multiple Same Direction Entries',
        entries,
      };

      await expect(usecase.execute(transactionPayload)).rejects.toThrow(
        new ApplicationException(
          'Account acc1 has multiple entries with the same direction — likely invalid',
          400,
        ),
      );
    });

    it('should update account balances correctly for same direction', async () => {
      const account1 = new AccountEntity('acc1', 'Account 1', 100, 'debit');
      const account2 = new AccountEntity('acc2', 'Account 2', 0, 'credit');

      const entries = [
        new EntryEntity('entry1', 'debit', 50, 'acc1'),
        new EntryEntity('entry2', 'credit', 50, 'acc2'),
      ];

      const transactionPayload = {
        name: 'Same Direction Transaction',
        entries,
      };

      mockAccountsRepository.findByIds.mockResolvedValue([account1, account2]);
      mockTransactionsRepository.create.mockResolvedValue();
      mockAccountsRepository.updateMany.mockResolvedValue();
      mockEntryRepository.createMany.mockResolvedValue(entries);

      await usecase.execute(transactionPayload);

      expect(mockAccountsRepository.updateMany).toHaveBeenCalledWith([
        expect.objectContaining({ id: 'acc1', balance: 150 }),
        expect.objectContaining({ id: 'acc2', balance: 50 }),
      ]);
    });

    it('should update account balances correctly for opposite direction', async () => {
      const account1 = new AccountEntity('acc1', 'Account 1', 100, 'debit');
      const account2 = new AccountEntity('acc2', 'Account 2', 50, 'credit');

      const entries = [
        new EntryEntity('entry1', 'credit', 30, 'acc1'),
        new EntryEntity('entry2', 'debit', 30, 'acc2'),
      ];

      const transactionPayload = {
        name: 'Opposite Direction Transaction',
        entries,
      };

      mockAccountsRepository.findByIds.mockResolvedValue([account1, account2]);
      mockTransactionsRepository.create.mockResolvedValue();
      mockAccountsRepository.updateMany.mockResolvedValue();
      mockEntryRepository.createMany.mockResolvedValue(entries);

      await usecase.execute(transactionPayload);

      expect(mockAccountsRepository.updateMany).toHaveBeenCalledWith([
        expect.objectContaining({ id: 'acc1', balance: 70 }),
        expect.objectContaining({ id: 'acc2', balance: 20 }),
      ]);
    });
  });
});
