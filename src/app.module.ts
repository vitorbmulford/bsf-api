// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm.config';
import { UsuariosModule } from '../src/usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UsuariosModule,
  ],
  providers: [TypeOrmConfigService],
})
export class AppModule {}
