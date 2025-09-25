import { AccountsRepository } from '@/app/contracts/repositories/accounts.repository';
import { AccountEntity } from '@/domain/entities/account';

export class GetAccountsUsecase {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async execute(payload?: { id: string }): Promise<AccountEntity[]> {
    if (payload?.id) {
      const account = await this.accountsRepository.findById(payload.id);
      if (!account) {
        return [];
      }
      return [account];
    }
    return await this.accountsRepository.findAll();
  }
}
