export class EntryEntity {
  id: string;
  direction: 'debit' | 'credit';
  amount: number;
  accountId: string;

  constructor(
    id: string,
    direction: 'debit' | 'credit',
    amount: number,
    accountId: string,
  ) {
    this.id = id;
    this.direction = direction;
    this.amount = amount;
    this.accountId = accountId;
  }
}
