import { randomUUID } from 'node:crypto';
import { TransactionEntity } from '@/domain/entities/transaction';
import { EntryRepository } from '@/app/contracts/repositories/entry.repository';
import { AccountsRepository } from '@/app/contracts/repositories/accounts.repository';
import { TransactionsRepository } from '@/app/contracts/repositories/transactions.repository';
import { ApplicationException } from '../exceptions/application.exception';
import { AccountEntity } from '@/domain/entities/account';
import { EntryEntity } from '@/domain/entities/entry';

export class CreateTransactionUsecase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly accountsRepository: AccountsRepository,
    private readonly entryRepository: EntryRepository,
  ) {}

  async execute(
    payload: Omit<TransactionEntity, 'id'> & { id?: string },
  ): Promise<TransactionEntity> {
    this.validateBalance(payload.entries);
    this.verifyIfAllEntriesHasSameDirection(payload.entries);
    this.validateConsistency(payload.entries);

    const id = payload.id ?? randomUUID().toString();

    const accountIds = payload.entries.map((item) => item.accountId);
    const accounts = await this.accountsRepository.findByIds(accountIds);

    const updatedAccounts: AccountEntity[] = [];
    for (const entry of payload.entries) {
      let account: AccountEntity | undefined = updatedAccounts.find(
        (item) => item.id === entry.accountId,
      );
      if (!account) {
        account = accounts.find((item) => item.id === entry.accountId);
      }

      if (!account) {
        throw new ApplicationException('Account not found', 404);
      }

      if (entry.direction !== account.direction) {
        if (account.balance < entry.amount) {
          throw new ApplicationException('Insufficient balance', 400);
        }
      }

      if (entry.direction === account.direction) {
        account.balance = account.balance + entry.amount;
      } else {
        account.balance = account.balance - entry.amount;
      }

      const updatedAccountIdx = updatedAccounts.findIndex(
        (item) => item.id === account.id,
      );

      if (updatedAccountIdx === -1) {
        updatedAccounts.push(account);
      } else {
        updatedAccounts[updatedAccountIdx] = account;
      }
    }

    await this.transactionsRepository.create({ ...payload, id });
    await this.accountsRepository.updateMany(updatedAccounts);
    const entries = await this.entryRepository.createMany(payload.entries);

    return {
      id,
      name: payload.name,
      entries,
    };
  }

  validateBalance(entries: EntryEntity[]) {
    const debits = entries
      .filter((entry) => entry.direction === 'debit')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const credits = entries
      .filter((entry) => entry.direction === 'credit')
      .reduce((sum, entry) => sum + entry.amount, 0);

    if (debits !== credits) {
      throw new ApplicationException('Transaction not balanced', 400);
    }
  }

  verifyIfAllEntriesHasSameDirection(entries: EntryEntity[]) {
    const directions = new Set(entries.map((e) => e.direction));
    if (!directions.has('debit') || !directions.has('credit')) {
      throw new ApplicationException(
        'Transaction must include at least one debit and one credit entry',
        400,
      );
    }
  }

  validateConsistency(entries: EntryEntity[]) {
    const groupedByAccount = entries.reduce(
      (acc, e) => {
        acc[e.accountId] = acc[e.accountId] || new Set();
        acc[e.accountId].add(e.direction);
        return acc;
      },
      {} as Record<string, Set<string>>,
    );

    for (const [accountId, dirs] of Object.entries(groupedByAccount)) {
      if (
        dirs.size === 1 &&
        entries.filter((e) => e.accountId === accountId).length > 1
      ) {
        throw new ApplicationException(
          `Account ${accountId} has multiple entries with the same direction — likely invalid`,
          400,
        );
      }
    }
  }
}
