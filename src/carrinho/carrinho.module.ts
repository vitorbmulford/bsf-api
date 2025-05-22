import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrinhoController } from './carrinho.controller';
import { CarrinhoService } from './carrinho.service';
import { ItemCarrinho } from './entities/item-carrinho.entity';
import { Carrinho } from './entities/carrinho.entity';
import { ProdutosModule } from '../produtos/produtos.module';
import { UsuariosModule } from 'src/usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemCarrinho, Carrinho]),
    ProdutosModule,
    UsuariosModule,
  ],
  controllers: [CarrinhoController],
  providers: [CarrinhoService],
})
export class CarrinhoModule {}
