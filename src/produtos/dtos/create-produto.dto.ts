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
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  preco!: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  precoPromocional?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descricao!: string;

  @ApiProperty()
  @IsUrl()
  imagemUrl!: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  estoque?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  categoria?: string;

  @ApiProperty({ enum: StatusProduto, required: false })
  @IsEnum(StatusProduto)
  @IsOptional()
  status?: StatusProduto;
}

export class AtualizarProdutoDto extends PartialType(CriarProdutoDto) {}
