import { IsString, IsIn } from 'class-validator';

export class UpdateCarrinhoStatusDto {
  @IsString()
  @IsIn(['aberto', 'finalizado', 'cancelado'])
  status!: 'aberto' | 'finalizado' | 'cancelado';
}
