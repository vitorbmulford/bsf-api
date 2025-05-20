import { IsNotEmpty, IsString } from 'class-validator';

export class RedefinirSenhaDto {
  @IsNotEmpty({ message: 'A nova senha é obrigatória' })
  @IsString({ message: 'A senha deve ser uma string' })
  novaSenha!: string;

  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória' })
  @IsString({ message: 'A confirmação de senha deve ser uma string' })
  confirmacaoSenha!: string;
}
