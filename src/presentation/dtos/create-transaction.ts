import { EntryEntity } from '@/domain/entities/entry';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

class EntryDTO {
  @IsString()
  @IsIn(['debit', 'credit'])
  direction: 'debit' | 'credit';

  @IsString()
  @IsUUID()
  account_id: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsUUID()
  id: string;
}

export class CreateTransactionRequestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  id: string;

  @IsArray()
  @IsNotEmpty()
  @Type(() => EntryDTO)
  @ValidateNested({ each: true })
  entries: EntryDTO[];
}

export class CreateTransactionResponseDTO {
  id: string;
  name: string;
  entries: Array<{
    account_id: string;
    amount: number;
    direction: EntryEntity['direction'];
    id: string;
  }>;
}
