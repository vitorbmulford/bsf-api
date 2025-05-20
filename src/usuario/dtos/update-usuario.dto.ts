import {
  IsOptional,
  IsString,
  IsEmail,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TipoUsuario {
  musico = 'musico',
  contratante = 'contratante',
  admin = 'admin',
}

export enum MidiaTipo {
  video = 'video',
  imagem = 'imagem',
}

export class UpdateMidiaDto {
  @IsOptional()
  @IsEnum(MidiaTipo, { message: 'Tipo de mídia inválido.' })
  tipo?: MidiaTipo;

  @IsOptional()
  @IsString()
  url?: string;
}

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  celular?: string;

  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido.' })
  email?: string;

  @IsOptional()
  @IsEnum(TipoUsuario, { message: 'Tipo de usuário inválido.' })
  tipo?: TipoUsuario;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  generos?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  instrumentos?: string[];

  @IsOptional()
  @IsString()
  biografia?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMidiaDto)
  midias?: UpdateMidiaDto[];
}
