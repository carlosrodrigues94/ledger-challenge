import { TransactionEntity } from '@/domain/entities/transaction';
import { readFile, writeFile } from 'fs/promises';
import { DATABASE_PATH } from '../config/database';

export class TransactionsRepository {
  async findById(id: string): Promise<TransactionEntity | undefined> {
    const database = await readFile(DATABASE_PATH, 'utf8');
    const { transactions }: { transactions: TransactionEntity[] } =
      JSON.parse(database);
    const transaction = transactions.find(
      (transaction) => transaction.id === id,
    );
    return transaction;
  }

  async create(transaction: TransactionEntity): Promise<void> {
    const database = await readFile(DATABASE_PATH, 'utf8');
    const { accounts, transactions, entries } = JSON.parse(database);
    transactions.push(transaction);
    await writeFile(
      DATABASE_PATH,
      JSON.stringify({ accounts, transactions, entries }, null, 2),
    );
  }
}
