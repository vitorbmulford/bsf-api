import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ItemCarrinho } from '../../carrinho/entities/item-carrinho.entity';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nome!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  preco!: number;

  @Column()
  descricao!: string;

  @Column()
  imagemUrl!: string;

  @Column({ default: 0 })
  estoque: number = 0;

  @OneToMany(() => ItemCarrinho, (item) => item.produto)
  itensCarrinho!: ItemCarrinho[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
