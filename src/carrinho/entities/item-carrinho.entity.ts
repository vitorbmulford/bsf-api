import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Produto } from '../../produtos/entities/produto.entity';
import { Carrinho } from './carrinho.entity';

@Entity('itens_carrinho')
export class ItemCarrinho {
  @PrimaryGeneratedColumn()
  id!: string;

  @ManyToOne(() => Carrinho, (carrinho) => carrinho.itens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'carrinho_id' })
  carrinho!: Carrinho;

  @ManyToOne(() => Produto)
  @JoinColumn({ name: 'produto_id' })
  produto!: Produto;

  @Column({ type: 'int' })
  quantidade!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precoUnitario!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal!: number;
}
