import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  Logger,
  NotFoundException,
  InternalServerErrorException,
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
  private readonly logger = new Logger(ProdutosController.name);

  constructor(private readonly produtosService: ProdutosService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar todos os produtos ativos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos',
    type: [Produto],
  })
  async buscarTodos(): Promise<{ mensagem: string; produtos: Produto[] }> {
    try {
      const produtos = await this.produtosService.buscarTodos();
      return {
        mensagem: 'Lista de produtos obtida com sucesso',
        produtos,
      };
    } catch (error: unknown) {
      this.logger.error(
        'Erro ao buscar todos os produtos',
        error instanceof Error ? error.stack : '',
      );
      throw new InternalServerErrorException(
        'Erro desconhecido ao buscar produtos',
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado',
    type: Produto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async buscarPorId(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ mensagem: string; produto: Produto }> {
    try {
      const produto = await this.produtosService.buscarPorId(id);
      if (!produto) {
        this.logger.warn(`Produto não encontrado para ID: ${id}`);
        throw new NotFoundException('Produto não encontrado');
      }
      return {
        mensagem: 'Produto encontrado com sucesso',
        produto,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Erro ao buscar produto com ID ${id}`,
        error instanceof Error ? error.stack : '',
      );
      throw new InternalServerErrorException(
        'Erro desconhecido ao buscar produto',
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso',
    type: Produto,
  })
  async criar(
    @Body() criarProdutoDto: CriarProdutoDto,
  ): Promise<{ mensagem: string; produto: Produto }> {
    try {
      const produto = await this.produtosService.criarProduto(criarProdutoDto);
      return {
        mensagem: 'Produto criado com sucesso',
        produto,
      };
    } catch (error: unknown) {
      this.logger.error(
        'Erro ao criar produto',
        error instanceof Error ? error.stack : '',
      );
      throw new InternalServerErrorException(
        'Erro desconhecido ao criar produto',
      );
    }
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
  ): Promise<{ mensagem: string; produto: Produto }> {
    try {
      const produto = await this.produtosService.atualizarProduto(
        id,
        atualizarProdutoDto,
      );
      if (!produto) {
        this.logger.warn(
          `Tentativa de atualizar produto não encontrado: ${id}`,
        );
        throw new NotFoundException('Produto não encontrado');
      }
      return {
        mensagem: 'Produto atualizado com sucesso',
        produto,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Erro ao atualizar produto com ID ${id}`,
        error instanceof Error ? error.stack : '',
      );
      throw new InternalServerErrorException(
        'Erro desconhecido ao atualizar produto',
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover (soft delete) um produto' })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async remover(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ mensagem: string }> {
    try {
      await this.produtosService.deletarProduto(id);
      return {
        mensagem: 'Produto removido com sucesso',
      };
    } catch (error: unknown) {
      this.logger.error(
        `Erro ao remover produto com ID ${id}`,
        error instanceof Error ? error.stack : '',
      );
      throw new InternalServerErrorException(
        'Erro desconhecido ao remover produto',
      );
    }
  }
}
