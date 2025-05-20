// src/usuarios/interfaces/usuario.interface.ts

export interface Usuario {
  id?: string; // UUID (gerado automaticamente)
  tipo: string; // Ex: 'musico', 'admin', etc.
  nome: string; // Nome completo
  celular?: string; // Opcional
  email: string; // E-mail (único)
  password: string; // Senha (hash)
  avatar?: string; // URL do avatar (opcional)
  status?: string; // Ex: 'ativo', 'inativo' (para soft delete)
  createdAt?: Date; // Data de criação
  updatedAt?: Date; // Data de atualização
}
