import { EntryEntity } from './entry';

export class TransactionEntity {
  id: string;
  name: string;
  entries: EntryEntity[];

  constructor(id: string, name: string, entries: EntryEntity[]) {
    this.id = id;
    this.name = name;
    this.entries = entries;
  }
}
