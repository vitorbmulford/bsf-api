import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemCarrinho } from './entities/item-carrinho.entity';
import { Produto } from '../produtos/entities/produto.entity';
import { Carrinho } from './entities/carrinho.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class CarrinhoService {
  private readonly logger = new Logger(CarrinhoService.name);

  constructor(
    @InjectRepository(ItemCarrinho)
    private itemCarrinhoRepository: Repository<ItemCarrinho>,

    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,

    @InjectRepository(Carrinho)
    private carrinhoRepository: Repository<Carrinho>,
  ) {}

  private async obterOuCriarCarrinhoDoUsuario(
    usuarioId: string,
  ): Promise<Carrinho> {
    let carrinho = await this.carrinhoRepository.findOne({
      where: { usuario: { id: usuarioId } },
    });

    if (!carrinho) {
      carrinho = this.carrinhoRepository.create({
        usuario: { id: usuarioId } as Usuario,
      });
      await this.carrinhoRepository.save(carrinho);
    }

    return carrinho;
  }

  async adicionarItem(
    usuarioId: string,
    produtoId: string,
    quantidade: number = 1,
  ): Promise<ItemCarrinho> {
    try {
      const produto = await this.produtoRepository.findOne({
        where: { id: produtoId },
      });

      if (!produto) {
        throw new NotFoundException('Produto não encontrado');
      }

      const carrinho = await this.obterOuCriarCarrinhoDoUsuario(usuarioId);

      let item = await this.itemCarrinhoRepository.findOne({
        where: {
          carrinho: { id: carrinho.id },
          produto: { id: produtoId },
        },
      });

      if (item) {
        item.quantidade += quantidade;
        item.subtotal = Number(item.precoUnitario) * item.quantidade;
      } else {
        if (quantidade <= 0) {
          throw new BadRequestException('Quantidade deve ser maior que zero');
        }

        item = this.itemCarrinhoRepository.create({
          carrinho,
          produto,
          quantidade,
          precoUnitario: produto.preco,
          subtotal: Number(produto.preco) * quantidade,
        });
      }

      return await this.itemCarrinhoRepository.save(item);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao adicionar item ao carrinho: ${error.message}`,
          error.stack,
        );
        if (
          error instanceof NotFoundException ||
          error instanceof BadRequestException
        ) {
          throw error;
        }
      } else {
        this.logger.error('Erro desconhecido ao adicionar item ao carrinho');
      }
      throw new InternalServerErrorException(
        'Erro ao adicionar item ao carrinho',
      );
    }
  }

  async obterCarrinho(usuarioId: string): Promise<ItemCarrinho[]> {
    try {
      const carrinho = await this.obterOuCriarCarrinhoDoUsuario(usuarioId);

      return await this.itemCarrinhoRepository.find({
        where: { carrinho: { id: carrinho.id } },
        relations: ['produto'],
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao obter carrinho: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error('Erro desconhecido ao obter carrinho');
      }
      throw new InternalServerErrorException('Erro ao obter carrinho');
    }
  }

  async removerItem(usuarioId: string, itemId: string): Promise<void> {
    try {
      const carrinho = await this.obterOuCriarCarrinhoDoUsuario(usuarioId);

      const result = await this.itemCarrinhoRepository.delete({
        id: itemId,
        carrinho: { id: carrinho.id },
      });

      if (result.affected === 0) {
        throw new NotFoundException('Item não encontrado no carrinho');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao remover item do carrinho: ${error.message}`,
          error.stack,
        );
        if (error instanceof NotFoundException) throw error;
      } else {
        this.logger.error('Erro desconhecido ao remover item do carrinho');
      }
      throw new InternalServerErrorException(
        'Erro ao remover item do carrinho',
      );
    }
  }

  async atualizarQuantidade(
    usuarioId: string,
    itemId: string,
    quantidade: number,
  ): Promise<ItemCarrinho> {
    try {
      const carrinho = await this.obterOuCriarCarrinhoDoUsuario(usuarioId);

      const item = await this.itemCarrinhoRepository.findOne({
        where: {
          id: itemId,
          carrinho: { id: carrinho.id },
        },
      });

      if (!item) {
        throw new NotFoundException('Item não encontrado no carrinho');
      }

      item.quantidade = quantidade;
      item.subtotal = Number(item.precoUnitario) * quantidade;

      return await this.itemCarrinhoRepository.save(item);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao atualizar quantidade: ${error.message}`,
          error.stack,
        );
        if (error instanceof NotFoundException) throw error;
      } else {
        this.logger.error('Erro desconhecido ao atualizar quantidade');
      }
      throw new InternalServerErrorException('Erro ao atualizar quantidade');
    }
  }

  async limparCarrinho(usuarioId: string): Promise<void> {
    try {
      const carrinho = await this.obterOuCriarCarrinhoDoUsuario(usuarioId);

      await this.itemCarrinhoRepository.delete({
        carrinho: { id: carrinho.id },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao limpar carrinho: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error('Erro desconhecido ao limpar carrinho');
      }
      throw new InternalServerErrorException('Erro ao limpar carrinho');
    }
  }
}
