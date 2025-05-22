/* eslint-disable prettier/prettier */
// produtos.service.ts
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto, StatusProduto } from './entities/produto.entity';
import {
  AtualizarProdutoDto,
  CriarProdutoDto,
} from './dtos/create-produto.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ProdutosService {
  private readonly logger = new Logger(ProdutosService.name);

  constructor(
    @InjectRepository(Produto)
    private readonly produtosRepository: Repository<Produto>,
  ) {}

  async buscarTodos(): Promise<Produto[]> {
    try {
      return await this.produtosRepository.find({
        where: { status: StatusProduto.ATIVO },
      });
    } catch (error) {
      this.logger.error('Erro ao buscar produtos', (error as Error).stack);
      throw error;
    }
  }

  async buscarPorId(id: string): Promise<Produto> {
    try {
      const produto = await this.produtosRepository.findOne({
        where: { id, status: StatusProduto.ATIVO },
      });
      if (!produto) {
        throw new NotFoundException('Produto não encontrado');
      }
      return produto;
    } catch (error) {
      this.logger.error(
        `Erro ao buscar produto com id ${id}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async criarProduto(dadosProduto: CriarProdutoDto): Promise<Produto> {
    try {
      const produto = this.produtosRepository.create(dadosProduto);
      return await this.produtosRepository.save(produto);
    } catch (error) {
      this.logger.error('Erro ao criar produto', (error as Error).stack);
      throw error;
    }
  }

  async atualizarProduto(
    id: string,
    dadosAtualizados: AtualizarProdutoDto,
  ): Promise<Produto> {
    try {
      const produto = await this.buscarPorId(id);
      Object.assign(produto, dadosAtualizados);
      return await this.produtosRepository.save(produto);
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar produto com id ${id}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async deletarProduto(id: string): Promise<void> {
    try {
      const resultado = await this.produtosRepository.softDelete(id);
      if (resultado.affected === 0) {
        throw new NotFoundException('Produto não encontrado para exclusão');
      }
    } catch (error) {
      this.logger.error(
        `Erro ao deletar produto com id ${id}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async processarAvatar(
    productId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const extension = path.extname(file.originalname);
    const filename = `avatar-${Date.now()}${extension}`;
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
    const uploadPath = path.join(uploadDir, filename);
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(uploadPath, file.buffer);

      const avatarUrl = `/uploads/avatars/${filename}`;

      const usuario = await this.produtosRepository.findOneBy({ id: productId });
      if (!usuario) throw new NotFoundException('Usuário não encontrado');

      usuario.avatar = avatarUrl;
      await this.produtosRepository.save(usuario);

      return avatarUrl;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Erro ao processar avatar: ${err.message}`, err.stack);
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Erro ao salvar arquivo');
    }
  }
}
