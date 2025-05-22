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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ProdutosService } from './produtos.service';
import { Produto } from './entities/produto.entity';
import {
  AtualizarProdutoDto,
  CriarProdutoDto,
} from './dtos/create-produto.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post(':_id/avatar')
  @ApiOperation({ summary: 'Upload de foto de perfil' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo de imagem para upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Avatar atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Param('_id') _id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Formato de arquivo não suportado.');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Tamanho máximo permitido é 5MB.');
    }

    try {
      const avatarUrl = await this.produtosService.processarAvatar(_id, file);
      return { mensagem: 'Avatar atualizado com sucesso', avatarUrl };
    } catch (error: unknown) {
      this.logger.error(
        'Erro ao fazer upload de avatar',
        error instanceof Error ? error.stack : '',
      );
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(
        'Erro desconhecido ao atualizar avatar',
      );
    }
  }
}
