export class AccountEntity {
  id: string;
  name: string;
  balance: number;
  direction: 'debit' | 'credit';

  constructor(
    id: string,
    name: string,
    balance: number,
    direction: 'debit' | 'credit',
  ) {
    this.id = id;
    this.name = name;
    this.balance = balance;
    this.direction = direction;
  }
}
