import { writeFile, readFile } from 'fs/promises';
import { AccountEntity } from '@/domain/entities/account';
import { DATABASE_PATH } from '@/app/contracts/config/database';

export class AccountsRepository {
  async create(account: AccountEntity): Promise<AccountEntity> {
    const database = await readFile(DATABASE_PATH, 'utf8');
    const { accounts, ...rest } = JSON.parse(database);
    accounts.push(account);

    await writeFile(
      DATABASE_PATH,
      JSON.stringify({ accounts, ...rest }, null, 2),
    );
    return account;
  }

  async findById(id: string): Promise<AccountEntity | undefined> {
    const database = await readFile(DATABASE_PATH, 'utf8');
    const { accounts }: { accounts: AccountEntity[] } = JSON.parse(database);
    const account = accounts.find((account) => account.id === id);
    return account;
  }

  async findAll(): Promise<AccountEntity[]> {
    const database = await readFile(DATABASE_PATH, 'utf8');
    const { accounts }: { accounts: AccountEntity[] } = JSON.parse(database);
    return accounts;
  }

  async findByIds(ids: string[]): Promise<AccountEntity[]> {
    const database = await readFile(DATABASE_PATH, 'utf8');
    const { accounts }: { accounts: AccountEntity[] } = JSON.parse(database);
    return accounts.filter((account) => ids.includes(account.id));
  }

  async updateMany(accounts: AccountEntity[]): Promise<void> {
    const database = await readFile(DATABASE_PATH, 'utf8');
    const {
      accounts: databaseAccounts,
      transactions,
      entries,
    } = JSON.parse(database);

    const updated = databaseAccounts.map((account) => {
      const updatedAccount = accounts.find((item) => item.id === account.id);
      if (!updatedAccount) return account;
      return updatedAccount;
    });

    await writeFile(
      DATABASE_PATH,
      JSON.stringify({ accounts: updated, transactions, entries }, null, 2),
    );
  }
}
