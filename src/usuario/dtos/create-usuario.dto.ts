import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  tipo!: string;

  @IsNotEmpty()
  nome!: string;

  @IsNotEmpty()
  celular!: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  email!: string;

  @IsNotEmpty()
  password!: string;
}
