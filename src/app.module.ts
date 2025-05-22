// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UsuariosModule } from './usuario/usuario.module';
import { ConfigModule } from '@nestjs/config';
import { CarrinhoModule } from './carrinho/carrinho.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UsuariosModule,
    CarrinhoModule,
  ],
})
export class AppModule {}
