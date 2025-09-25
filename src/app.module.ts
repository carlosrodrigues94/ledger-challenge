import { Module } from '@nestjs/common';
import { GetAccountsUsecase } from '@/app/usecases/get-accounts.usecase';
import { CreateTransactionUsecase } from '@/app/usecases/create-transaction.usecase';
import { AccountsRepository } from '@/app/contracts/repositories/accounts.repository';
import { TransactionsRepository } from '@/app/contracts/repositories/transactions.repository';
import { EntryRepository } from '@/app/contracts/repositories/entry.repository';
import { CreateAccountUsecase } from '@/app/usecases/create-account.usecase';
import { AccountsController } from '@/presentation/controllers/accounts.controller';
import { TransactionsController } from '@/presentation/controllers/transactions.controller';

@Module({
  imports: [],
  controllers: [AccountsController, TransactionsController],
  providers: [
    AccountsRepository,
    TransactionsRepository,
    EntryRepository,
    {
      provide: CreateAccountUsecase,
      inject: [AccountsRepository],
      useFactory: (accountsRepository: AccountsRepository) =>
        new CreateAccountUsecase(accountsRepository),
    },
    {
      provide: GetAccountsUsecase,
      inject: [AccountsRepository],
      useFactory: (accountsRepository: AccountsRepository) =>
        new GetAccountsUsecase(accountsRepository),
    },
    {
      provide: CreateTransactionUsecase,
      inject: [AccountsRepository, TransactionsRepository, EntryRepository],
      useFactory: (
        accountsRepository: AccountsRepository,
        transactionsRepository: TransactionsRepository,
        entryRepository: EntryRepository,
      ) =>
        new CreateTransactionUsecase(
          transactionsRepository,
          accountsRepository,
          entryRepository,
        ),
    },
  ],
})
export class AppModule {}
