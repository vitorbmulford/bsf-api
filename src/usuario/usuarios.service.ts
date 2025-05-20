import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dtos/create-usuario.dto';
import { UpdateUsuarioDto } from './dtos/update-usuario.dto';
import { RedefinirSenhaDto } from './dtos/redefinir-senha.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  async criarUsuario(dto: CreateUsuarioDto): Promise<Usuario> {
    try {
      const usuario = this.usuariosRepository.create(dto);
      const saved = await this.usuariosRepository.save(usuario);
      this.logger.log(`Usuário criado com sucesso: ${saved.id}`);
      return saved;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Erro ao criar usuário: ${err.message}`, err.stack);
      throw new InternalServerErrorException(err.message);
    }
  }

  async consultarUsuarioKey(id: string): Promise<Usuario> {
    try {
      const usuario = await this.usuariosRepository.findOneBy({ id });
      if (!usuario) throw new NotFoundException('Usuário não encontrado');
      return usuario;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Erro ao buscar usuário ${id}: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(err.message);
    }
  }

  async consultarUsuarios(): Promise<Usuario[]> {
    try {
      return await this.usuariosRepository.find();
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error('Erro ao buscar todos os usuários:', err.message);
      throw new InternalServerErrorException(err.message);
    }
  }

  async consultarUsuarioPorEmail(email: string): Promise<Usuario | null> {
    try {
      const usuario = await this.usuariosRepository.findOneBy({ email });
      this.logger.log(
        `Usuário ${usuario ? 'encontrado' : 'não encontrado'} para email: ${email}`,
      );
      return usuario;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Erro ao buscar usuário por email ${email}: ${err.message}`,
      );
      throw new InternalServerErrorException(err.message);
    }
  }

  async atualizarUsuario(id: string, dto: UpdateUsuarioDto): Promise<Usuario> {
    try {
      await this.usuariosRepository.update(id, dto);
      const updated = await this.usuariosRepository.findOneBy({ id });
      if (!updated)
        throw new NotFoundException('Usuário não encontrado após atualização');
      return updated;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Erro ao atualizar usuário ${id}: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(err.message);
    }
  }

  async deletarUsuario(id: string): Promise<{ mensagem: string }> {
    try {
      await this.usuariosRepository.update(id, { status: 'inativo' });
      return { mensagem: 'Usuário deletado (soft delete) com sucesso.' };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Erro ao deletar usuário ${id}: ${err.message}`);
      throw new InternalServerErrorException(err.message);
    }
  }

  async auth(email: string, senha: string): Promise<Usuario | null> {
    try {
      const usuario = await this.usuariosRepository
        .createQueryBuilder('usuario')
        .addSelect('usuario.password')
        .where('usuario.email = :email', { email })
        .getOne();

      if (!usuario) {
        this.logger.warn(
          `Login falhou: usuário não encontrado para email: ${email}`,
        );
        return null;
      }

      this.logger.log(`Login bem-sucedido para email: ${email}`);
      return usuario;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Erro no login para email ${email}: ${err.message}`);
      throw new InternalServerErrorException(err.message);
    }
  }

  async redefinirSenha(
    id: string,
    dto: RedefinirSenhaDto,
  ): Promise<{ mensagem: string }> {
    try {
      if (dto.novaSenha !== dto.confirmacaoSenha) {
        throw new BadRequestException('As senhas não coincidem');
      }

      const usuario = await this.usuariosRepository.findOneBy({ id });
      if (!usuario) throw new NotFoundException('Usuário não encontrado');

      usuario.password = dto.novaSenha;
      await this.usuariosRepository.save(usuario);

      this.logger.log(`Senha alterada para o usuário ${id}`);
      return { mensagem: 'Senha alterada com sucesso' };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Erro em redefinirSenha: ${err.message}`, err.stack);
      throw new InternalServerErrorException('Erro ao redefinir senha');
    }
  }

  async processarAvatar(
    userId: string,
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

      const usuario = await this.usuariosRepository.findOneBy({ id: userId });
      if (!usuario) throw new NotFoundException('Usuário não encontrado');

      usuario.avatar = avatarUrl;
      await this.usuariosRepository.save(usuario);

      return avatarUrl;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Erro ao processar avatar: ${err.message}`, err.stack);
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Erro ao salvar arquivo');
    }
  }
}
