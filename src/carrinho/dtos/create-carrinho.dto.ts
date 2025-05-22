import { IsOptional, IsUUID } from 'class-validator';

export class CreateCarrinhoDto {
  @IsUUID()
  @IsOptional()
  usuarioId?: string;
}
