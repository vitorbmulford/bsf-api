import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { Produto } from './entities/produto.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Produtos')
@Controller('produtos')
export class ProdutosController {
  private readonly logger = new Logger(ProdutosController.name);

  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async criar(
    @Body() produtoData: Partial<Produto>,
  ): Promise<{ mensagem: string; produto: Produto }> {
    try {
      const produto = await this.produtosService.criar(produtoData);
      return {
        mensagem: 'Produto criado com sucesso',
        produto,
      };
    } catch (error: unknown) {
      this.logger.error(
        'Erro ao criar produto',
        error instanceof Error ? error.stack : '',
      );
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(
        'Erro desconhecido ao criar produto',
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso',
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
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(
        'Erro desconhecido ao buscar produtos',
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um produto por ID' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
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
      this.logger.error(
        `Erro ao buscar produto com ID ${id}`,
        error instanceof Error ? error.stack : '',
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(
        'Erro desconhecido ao buscar produto',
      );
    }
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar um produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: Partial<Produto>,
  ): Promise<{ mensagem: string; produto: Produto }> {
    try {
      const produto = await this.produtosService.atualizar(id, updateData);
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
      this.logger.error(
        `Erro ao atualizar produto com ID ${id}`,
        error instanceof Error ? error.stack : '',
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(
        'Erro desconhecido ao atualizar produto',
      );
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover um produto' })
  @ApiResponse({ status: 200, description: 'Produto removido' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async remover(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ mensagem: string }> {
    try {
      await this.produtosService.remover(id);
      return {
        mensagem: 'Produto removido com sucesso',
      };
    } catch (error: unknown) {
      this.logger.error(
        `Erro ao remover produto com ID ${id}`,
        error instanceof Error ? error.stack : '',
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(
        'Erro desconhecido ao remover produto',
      );
    }
  }
}
