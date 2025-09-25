import { Body, Controller, Post } from '@nestjs/common';
import { CreateTransactionUsecase } from '@/app/usecases/create-transaction.usecase';
import { CreateTransactionRequestDTO } from '@/presentation/dtos/create-transaction';
import { TransactionEntity } from '@/domain/entities/transaction';

@Controller()
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUsecase,
  ) {}

  @Post('transactions')
  createTransaction(
    @Body() body: CreateTransactionRequestDTO,
  ): Promise<TransactionEntity> {
    return this.createTransactionUseCase.execute({
      ...body,
      entries: body.entries.map((item) => ({
        ...item,
        accountId: item.account_id,
      })),
    });
  }
}
