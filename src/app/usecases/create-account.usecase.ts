import { randomUUID } from 'node:crypto';
import { AccountsRepository } from '@/app/contracts/repositories/accounts.repository';
import { AccountEntity } from '@/domain/entities/account';

export class CreateAccountUsecase {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async execute(
    payload: Omit<AccountEntity, 'id' | 'balance'> & { id?: string },
  ): Promise<AccountEntity> {
    const id = payload.id ?? randomUUID().toString();
    const account = new AccountEntity(id, payload.name, 0, payload.direction);

    await this.accountsRepository.create(account);
    return account;
  }
}
