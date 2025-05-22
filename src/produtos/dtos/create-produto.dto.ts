// dto/create-produto.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUrl,
  Min,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StatusProduto } from '../entities/produto.entity';

export class CriarProdutoDto {
  @ApiProperty({ example: 'Hambúrguer de Fraldinha' })
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @ApiProperty({ example: 24.9 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  preco!: number;

  @ApiProperty({ example: 20.9, required: false })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  precoPromocional?: number;

  @ApiProperty({
    example: 'Delicioso hambúrguer de fraldinha com queijo cheddar',
  })
  @IsString()
  @IsNotEmpty()
  descricao!: string;

  @ApiProperty({ example: 'https://link-da-imagem.com/imagem.png' })
  @IsUrl()
  imagemUrl!: string;

  @ApiProperty({ example: 10, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  estoque?: number;

  @ApiProperty({ example: 'Lanches', required: false })
  @IsString()
  @IsOptional()
  categoria?: string;

  @ApiProperty({
    example: StatusProduto.ATIVO,
    enum: StatusProduto,
    required: false,
  })
  @IsEnum(StatusProduto)
  @IsOptional()
  status?: StatusProduto;
}

export class AtualizarProdutoDto extends PartialType(CriarProdutoDto) {}
