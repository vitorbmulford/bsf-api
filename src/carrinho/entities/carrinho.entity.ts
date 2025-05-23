import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ItemCarrinho } from './item-carrinho.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Entity('carrinhos')
export class Carrinho {
  @PrimaryGeneratedColumn()
  id!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.carrinhos)
  @JoinColumn({ name: 'usuario_id' })
  usuario!: Usuario;

  @OneToMany(() => ItemCarrinho, (item) => item.carrinho, {
    cascade: true,
  })
  itens!: ItemCarrinho[];

  @Column({ type: 'varchar', length: 20, default: 'aberto' })
  status!: 'aberto' | 'finalizado' | 'cancelado';

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
