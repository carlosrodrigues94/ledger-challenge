import { EntryEntity } from '@/domain/entities/entry';
import { writeFile, readFile } from 'fs/promises';
import { DATABASE_PATH } from '../config/database';

export class EntryRepository {
  async createMany(payload: EntryEntity[]): Promise<EntryEntity[]> {
    const database = await readFile(DATABASE_PATH, 'utf8');
    const { accounts, transactions, entries } = JSON.parse(database);
    entries.push(...payload);
    await writeFile(
      DATABASE_PATH,
      JSON.stringify({ accounts, transactions, entries }, null, 2),
    );
    return entries;
  }
}
