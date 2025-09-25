export class AccountEntity {
  id: string;
  name: string;
  balance: number;
  direction: string;

  constructor(id: string, name: string, balance: number, direction: string) {
    this.id = id;
    this.name = name;
    this.balance = balance;
    this.direction = direction;
  }
}
