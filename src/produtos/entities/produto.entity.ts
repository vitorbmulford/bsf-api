// entities/produto.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum StatusProduto {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
}

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id!: string;

  @Column()
  @ApiProperty({
    description: 'Nome do produto',
  })
  nome!: string;

  @Column({ type: 'decimal' })
  @ApiProperty({ description: 'Preço do produto' })
  preco!: number;

  @Column({ type: 'decimal', nullable: true })
  @ApiProperty({
    description: 'Preço promocional do produto',
    required: false,
  })
  precoPromocional?: number;

  @Column()
  @ApiProperty({
    description: 'Descrição do produto',
  })
  descricao!: string;

  @Column()
  @ApiProperty({
    description: 'URL da imagem do produto',
  })
  imagemUrl!: string;

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: 'Quantidade em estoque' })
  estoque!: number;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Categoria do produto',
    required: false,
  })
  categoria?: string;

  @Column({
    type: 'enum',
    enum: StatusProduto,
    default: StatusProduto.ATIVO,
  })
  status!: StatusProduto;

  @Column({ type: 'varchar', nullable: true })
  avatar!: string;

  @CreateDateColumn()
  criadoEm!: Date;

  @UpdateDateColumn()
  atualizadoEm!: Date;

  @DeleteDateColumn({ nullable: true })
  deletadoEm?: Date;
}
