import { CreateAccountUsecase } from '@/app/usecases/create-account.usecase';
import { GetAccountsUsecase } from '@/app/usecases/get-accounts.usecase';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  CreateAccountRequestDTO,
  CreateAccountResponseDTO,
} from '../dtos/create-account';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly createAccountUsecase: CreateAccountUsecase,
    private readonly getAccountsUsecase: GetAccountsUsecase,
  ) {}

  @Get(':id')
  async getAccount(@Param('id') id: string) {
    return this.getAccountsUsecase.execute({ id });
  }

  @Get()
  getAccounts() {
    return this.getAccountsUsecase.execute();
  }

  @Post()
  createAccount(
    @Body() body: CreateAccountRequestDTO,
  ): Promise<CreateAccountResponseDTO> {
    return this.createAccountUsecase.execute(body);
  }
}
