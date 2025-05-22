import { IsUUID, IsInt, Min } from 'class-validator';

export class AddItemDto {
  @IsUUID()
  produtoId!: string;

  @IsInt()
  @Min(1)
  quantidade!: number;
}
