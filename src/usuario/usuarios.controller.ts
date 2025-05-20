import {
  Body,
  Controller,
  Post,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
  Get,
  NotFoundException,
  Query,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UsuariosService } from '../services/usuarios.service';
import { CreateUsuarioDto } from './dtos/create-usuario.dto';
import { LoginDto } from './dtos/auth.dto';
import { RedefinirSenhaDto } from './dtos/redefinir-senha.dto';
import { Usuario } from './interfaces/usuario.interface';
import { UpdateUsuarioDto } from './dtos/update-usuario.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UsePipes(ValidationPipe)
@ApiTags('Usuários')
@Controller('usuarios')
export class UsuariosController {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro')
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  async registrar(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<{ mensagem: string; usuario: Usuario }> {
    try {
      const usuarioExistente =
        await this.usuariosService.consultarUsuarioPorEmail(
          createUsuarioDto.email,
        );

      if (usuarioExistente) {
        throw new ConflictException('Email já está em uso');
      }

      const novoUsuario =
        await this.usuariosService.criarUsuario(createUsuarioDto);

      return {
        mensagem: 'Usuário registrado com sucesso',
        usuario: novoUsuario,
      };
    } catch (error: unknown) {
      this.logger.error(
        'Erro ao registrar usuário',
        error instanceof Error ? error.stack : '',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }

      throw new InternalServerErrorException(
        'Erro desconhecido ao registrar usuário',
      );
    }
  }

  @Post('auth')
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ mensagem: string; usuario: Usuario }> {
    try {
      const usuario = await this.usuariosService.auth(
        loginDto.email,
        loginDto.password,
      );
      if (!usuario) {
        throw new UnauthorizedException('Credenciais inválidas');
      }
      return {
        mensagem: 'Login realizado com sucesso',
        usuario,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Erro desconhecido no login');
    }
  }

  @Get('consultarUsuarioPorEmail')
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async buscarPorEmail(
    @Query('email') email: string,
  ): Promise<{ mensagem: string; usuario: Usuario }> {
    try {
      const usuario =
        await this.usuariosService.consultarUsuarioPorEmail(email);
      if (!usuario) {
        this.logger.warn(`Usuário não encontrado para email: ${email}`);
        throw new NotFoundException('Usuário não encontrado');
      }
      this.logger.log(`Usuário encontrado para email: ${email}`);
      return {
        mensagem: 'Usuário encontrado com sucesso',
        usuario,
      };
    } catch (error: unknown) {
      this.logger.error(
        `Erro ao buscar usuário com email ${email}`,
        error instanceof Error ? error.stack : '',
      );
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(
        'Erro desconhecido ao buscar por email',
      );
    }
  }

  @Get(':_id')
  @ApiOperation({ summary: 'Obter usuário por ID' })
  @ApiParam({ name: '_id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async consultarUsuarioKey(
    @Param('_id') _id: string,
  ): Promise<{ mensagem: string; usuario: Usuario }> {
    try {
      const usuario = await this.usuariosService.consultarUsuarioKey(_id);
      if (!usuario) {
        this.logger.warn(`Usuário não encontrado para ID: ${_id}`);
        throw new NotFoundException('Usuário não encontrado');
      }
      return {
        mensagem: 'Usuário encontrado com sucesso',
        usuario,
      };
    } catch (error: unknown) {
      this.logger.error(
        `Erro ao buscar usuário com ID ${_id}`,
        error instanceof Error ? error.stack : '',
      );
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(
        'Erro desconhecido ao buscar usuário',
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
  })
  async consultarUsuarios(): Promise<{
    mensagem: string;
    usuarios: Usuario[];
  }> {
    try {
      const usuarios = await this.usuariosService.consultarUsuarios();
      return {
        mensagem: 'Lista de usuários obtida com sucesso',
        usuarios,
      };
    } catch (error: unknown) {
      this.logger.error(
        'Erro ao buscar todos os usuários',
        error instanceof Error ? error.stack : '',
      );
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(
        'Erro desconhecido ao consultar usuários',
      );
    }
  }

  @Put(':_id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: '_id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async atualizarUsuario(
    @Param('_id') _id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<{ mensagem: string; usuario: Usuario }> {
    try {
      const usuario = await this.usuariosService.atualizarUsuario(
        _id,
        updateUsuarioDto,
      );
      if (!usuario) {
        this.logger.warn(
          `Tentativa de atualizar usuário não encontrado: ${_id}`,
        );
        throw new NotFoundException('Usuário não encontrado');
      }
      return {
        mensagem: 'Usuário atualizado com sucesso',
        usuario,
      };
    } catch (error: unknown) {
      this.logger.error(
        `Erro ao atualizar usuário com ID ${_id}`,
        error instanceof Error ? error.stack : '',
      );
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(
        'Erro desconhecido ao atualizar usuário',
      );
    }
  }

  @Put(':_id/redefinir-senha')
  @ApiParam({ name: '_id', required: true, description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async redefinirSenha(
    @Param('_id') _id: string,
    @Body() redefinirSenhaDto: RedefinirSenhaDto,
  ): Promise<{ mensagem: string }> {
    try {
      return await this.usuariosService.redefinirSenha(_id, redefinirSenhaDto);
    } catch (error: unknown) {
      this.logger.error(
        'Erro no endpoint redefinir-senha',
        error instanceof Error ? error.stack : '',
      );
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(
        'Erro desconhecido ao redefinir senha',
      );
    }
  }

  @Delete(':_id')
  @ApiOperation({ summary: 'Deletar usuário (soft delete)' })
  @ApiParam({ name: '_id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário marcado como inativo com sucesso',
  })
  async deletarUsuario(
    @Param('_id') _id: string,
  ): Promise<{ mensagem: string }> {
    try {
      await this.usuariosService.deletarUsuario(_id);
      return {
        mensagem: 'Usuário marcado como inativo com sucesso',
      };
    } catch (error: unknown) {
      this.logger.error(
        `Erro ao deletar usuário com ID ${_id}`,
        error instanceof Error ? error.stack : '',
      );
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(
        'Erro desconhecido ao deletar usuário',
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
      const avatarUrl = await this.usuariosService.processarAvatar(_id, file);
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
