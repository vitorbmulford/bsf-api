import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './entities/produto.entity';

@Injectable()
export class ProdutosService {
  private readonly logger = new Logger(ProdutosService.name);

  constructor(
    @InjectRepository(Produto)
    private readonly produtosRepository: Repository<Produto>,
  ) {}

  async criar(produtoData: Partial<Produto>): Promise<Produto> {
    try {
      const produto = this.produtosRepository.create(produtoData);
      return await this.produtosRepository.save(produto);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao criar produto: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error('Erro desconhecido ao criar produto');
      }
      throw new InternalServerErrorException('Erro ao criar produto');
    }
  }

  async buscarTodos(): Promise<Produto[]> {
    try {
      return await this.produtosRepository.find();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao buscar produtos: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error('Erro desconhecido ao buscar produtos');
      }
      throw new InternalServerErrorException('Erro ao buscar produtos');
    }
  }

  async buscarPorId(id: string): Promise<Produto> {
    try {
      const produto = await this.produtosRepository.findOne({ where: { id } });
      if (!produto) {
        throw new NotFoundException('Produto não encontrado');
      }
      return produto;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao buscar produto: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error('Erro desconhecido ao buscar produto');
      }
      throw new InternalServerErrorException('Erro ao buscar produto');
    }
  }

  async atualizar(id: string, updateData: Partial<Produto>): Promise<Produto> {
    try {
      await this.produtosRepository.update(id, updateData);
      return await this.buscarPorId(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao atualizar produto: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error('Erro desconhecido ao atualizar produto');
      }
      throw new InternalServerErrorException('Erro ao atualizar produto');
    }
  }

  async remover(id: string): Promise<void> {
    try {
      const result = await this.produtosRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Produto não encontrado');
      }
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao remover produto: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error('Erro desconhecido ao remover produto');
      }
      throw new InternalServerErrorException('Erro ao remover produto');
    }
  }
}
