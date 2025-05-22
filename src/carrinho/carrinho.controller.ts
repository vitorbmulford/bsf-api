import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  ParseUUIDPipe,
  ParseIntPipe,
  HttpCode,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CarrinhoService } from './carrinho.service';
import { ItemCarrinho } from './entities/item-carrinho.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Carrinho')
@Controller('carrinho')
export class CarrinhoController {
  private readonly logger = new Logger(CarrinhoController.name);

  constructor(private readonly carrinhoService: CarrinhoService) {}

  @Post(':usuarioId/:produtoId')
  @ApiOperation({ summary: 'Adicionar item ao carrinho' })
  @ApiResponse({
    status: 201,
    description: 'Item adicionado ao carrinho com sucesso',
    type: ItemCarrinho,
  })
  async adicionarItem(
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
    @Param('produtoId', ParseUUIDPipe) produtoId: string,
    @Body('quantidade', ParseIntPipe) quantidade: number,
  ): Promise<{ mensagem: string; item: ItemCarrinho }> {
    try {
      const qty = quantidade && quantidade > 0 ? quantidade : 1;
      const item = await this.carrinhoService.adicionarItem(
        usuarioId,
        produtoId,
        qty,
      );
      return {
        mensagem: 'Item adicionado ao carrinho com sucesso',
        item,
      };
    } catch (error) {
      this.logger.error(
        'Erro ao adicionar item no carrinho',
        error instanceof Error ? error.stack : '',
      );
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Erro desconhecido',
      );
    }
  }

  @Get(':usuarioId')
  @ApiOperation({ summary: 'Obter itens do carrinho' })
  @ApiResponse({
    status: 200,
    description: 'Lista de itens do carrinho',
    type: [ItemCarrinho],
  })
  async obterCarrinho(
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
  ): Promise<{ mensagem: string; itens: ItemCarrinho[] }> {
    try {
      const itens = await this.carrinhoService.obterCarrinho(usuarioId);
      return {
        mensagem: 'Itens do carrinho obtidos com sucesso',
        itens,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao obter carrinho do usuário ${usuarioId}`,
        error instanceof Error ? error.stack : '',
      );
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Erro desconhecido',
      );
    }
  }

  @Delete(':usuarioId/:itemId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  async removerItem(
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ): Promise<{ mensagem: string }> {
    try {
      await this.carrinhoService.removerItem(usuarioId, itemId);
      return {
        mensagem: 'Item removido do carrinho com sucesso',
      };
    } catch (error) {
      this.logger.error(
        `Erro ao remover item ${itemId} do carrinho do usuário ${usuarioId}`,
        error instanceof Error ? error.stack : '',
      );
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Erro desconhecido',
      );
    }
  }

  @Put(':usuarioId/:itemId/quantidade')
  @ApiOperation({ summary: 'Atualizar quantidade do item no carrinho' })
  @ApiResponse({
    status: 200,
    description: 'Quantidade atualizada',
    type: ItemCarrinho,
  })
  async atualizarQuantidade(
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body('quantidade', ParseIntPipe) quantidade: number,
  ): Promise<{ mensagem: string; item: ItemCarrinho | null }> {
    try {
      if (quantidade <= 0) {
        await this.carrinhoService.removerItem(usuarioId, itemId);
        return {
          mensagem: 'Quantidade zerada ou negativa. Item removido do carrinho.',
          item: null,
        };
      }
      const item = await this.carrinhoService.atualizarQuantidade(
        usuarioId,
        itemId,
        quantidade,
      );
      return {
        mensagem: 'Quantidade do item atualizada com sucesso',
        item,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar quantidade do item ${itemId} no carrinho do usuário ${usuarioId}`,
        error instanceof Error ? error.stack : '',
      );
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Erro desconhecido',
      );
    }
  }

  @Delete(':usuarioId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Limpar carrinho' })
  @ApiResponse({ status: 200, description: 'Carrinho limpo com sucesso' })
  async limparCarrinho(
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
  ): Promise<{ mensagem: string }> {
    try {
      await this.carrinhoService.limparCarrinho(usuarioId);
      return {
        mensagem: 'Carrinho limpo com sucesso',
      };
    } catch (error) {
      this.logger.error(
        `Erro ao limpar carrinho do usuário ${usuarioId}`,
        error instanceof Error ? error.stack : '',
      );
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Erro desconhecido',
      );
    }
  }
}
