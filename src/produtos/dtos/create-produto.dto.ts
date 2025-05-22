import { IsString, IsNumber, IsUrl, IsNotEmpty } from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsNumber()
  preco!: number;

  @IsString()
  @IsNotEmpty()
  descricao!: string;

  @IsUrl()
  imagemUrl!: string;

  @IsNumber()
  estoque!: number;
}
