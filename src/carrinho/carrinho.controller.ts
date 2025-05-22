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
} from '@nestjs/common';
import { CarrinhoService } from './carrinho.service';
import { ItemCarrinho } from './entities/item-carrinho.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Carrinho')
@Controller('carrinho')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}

  @Post(':usuarioId/:produtoId')
  @ApiOperation({ summary: 'Adicionar item ao carrinho' })
  @ApiResponse({
    status: 201,
    description: 'Item adicionado ao carrinho com sucesso',
    type: ItemCarrinho,
  })
  async adicionarItem(
    @Param('usuarioId') usuarioId: string,
    @Param('produtoId') produtoId: string,
    @Body('quantidade') quantidade: number,
  ): Promise<ItemCarrinho> {
    const qty = quantidade && quantidade > 0 ? quantidade : 1;
    return this.carrinhoService.adicionarItem(usuarioId, produtoId, qty);
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
  ): Promise<ItemCarrinho[]> {
    return this.carrinhoService.obterCarrinho(usuarioId);
  }

  @Delete(':usuarioId/:itemId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiResponse({ status: 204, description: 'Item removido com sucesso' })
  async removerItem(
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ): Promise<void> {
    await this.carrinhoService.removerItem(usuarioId, itemId);
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
  ): Promise<ItemCarrinho> {
    if (quantidade <= 0) {
      await this.carrinhoService.removerItem(usuarioId, itemId);
    }
    return this.carrinhoService.atualizarQuantidade(
      usuarioId,
      itemId,
      quantidade,
    );
  }

  @Delete(':usuarioId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Limpar carrinho' })
  @ApiResponse({ status: 204, description: 'Carrinho limpo com sucesso' })
  async limparCarrinho(
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
  ): Promise<void> {
    await this.carrinhoService.limparCarrinho(usuarioId);
  }
}
