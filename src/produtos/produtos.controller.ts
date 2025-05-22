// produtos.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProdutosService } from './produtos.service';
import { Produto } from './entities/produto.entity';
import {
  AtualizarProdutoDto,
  CriarProdutoDto,
} from './dtos/create-produto.dto';

@ApiTags('produtos')
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar todos os produtos ativos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos',
    type: [Produto],
  })
  async buscarTodos(): Promise<Produto[]> {
    return this.produtosService.buscarTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado',
    type: Produto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async buscarPorId(@Param('id', ParseUUIDPipe) id: string): Promise<Produto> {
    return this.produtosService.buscarPorId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso',
    type: Produto,
  })
  async criar(@Body() criarProdutoDto: CriarProdutoDto): Promise<Produto> {
    return this.produtosService.criarProduto(criarProdutoDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso',
    type: Produto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() atualizarProdutoDto: AtualizarProdutoDto,
  ): Promise<Produto> {
    return this.produtosService.atualizarProduto(id, atualizarProdutoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover (soft delete) um produto' })
  @ApiResponse({ status: 204, description: 'Produto removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async remover(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.produtosService.deletarProduto(id);
  }
}
