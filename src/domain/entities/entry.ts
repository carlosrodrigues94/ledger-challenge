export class EntryEntity {
  id: string;
  direction: string;
  amount: number;
  accountId: string;

  constructor(
    id: string,
    direction: string,
    amount: number,
    accountId: string,
  ) {
    this.id = id;
    this.direction = direction;
    this.amount = amount;
    this.accountId = accountId;
  }
}
