import { IsString, IsIn, IsOptional, IsUUID } from 'class-validator';

export class CreateAccountRequestDTO {
  @IsString()
  name: string;

  @IsString()
  @IsIn(['debit', 'credit'])
  direction: 'debit' | 'credit';

  @IsOptional()
  @IsString()
  @IsUUID()
  id?: string;
}

export class CreateAccountResponseDTO {
  id: string;
  name: string;
  balance: number;
  direction: 'debit' | 'credit';
}
