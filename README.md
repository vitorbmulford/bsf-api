📦 Documentação da API - Sistema de Carrinho, Usuários e Produtos
🛍️ Carrinho
🔸 Criar Carrinho

    POST /carrinhos

    Body:

{
  "usuarioId": "uuid (opcional)"
}

    Descrição: Cria um carrinho novo. Se não for informado o usuarioId, o carrinho fica desvinculado.

🔸 Adicionar Item ao Carrinho

    POST /carrinhos/:id/itens

    Body:

{
  "produtoId": "uuid",
  "quantidade": 1
}

    Descrição: Adiciona um item ao carrinho especificado por id. Se o item já existir, atualiza a quantidade.

🔸 Atualizar Quantidade de um Item

    PATCH /carrinhos/:id/itens/:itemId

    Body:

{
  "quantidade": 2
}

    Descrição: Atualiza a quantidade de um item específico no carrinho.

🔸 Alterar Status do Carrinho

    PATCH /carrinhos/:id/status

    Body:

{
  "status": "aberto" | "finalizado" | "cancelado"
}

    Descrição: Atualiza o status do carrinho. (Enum: aberto, finalizado, cancelado)

🔸 Remover Item do Carrinho

    DELETE /carrinhos/:id/itens/:itemId

    Descrição: Remove um item do carrinho.

🛒 Produtos
🔸 Criar Produto

    POST /produtos

    Body:

{
  "nome": "string",
  "preco": 100.00,
  "descricao": "string",
  "imagemUrl": "url válida",
  "estoque": 10
}

    Descrição: Cria um novo produto no sistema.

🔸 Atualizar Produto

    PATCH /produtos/:id

    Body:

{
  "nome": "string (opcional)",
  "preco": 100.00 (opcional),
  "descricao": "string (opcional)",
  "imagemUrl": "url válida (opcional)",
  "estoque": 10 (opcional)
}

    Descrição: Atualiza os dados de um produto.

🔸 Listar Produtos

    GET /produtos

    Descrição: Retorna uma lista de todos os produtos.

🔸 Buscar Produto por ID

    GET /produtos/:id

    Descrição: Retorna os dados de um produto específico.

🔸 Deletar Produto

    DELETE /produtos/:id

    Descrição: Remove um produto do sistema.

👤 Usuários
🔸 Criar Usuário

    POST /usuarios

    Body:

{
  "tipo": "string",
  "nome": "string",
  "celular": "string",
  "email": "email válido",
  "password": "string"
}

    Descrição: Cria um usuário.

🔸 Login

    POST /auth/login

    Body:

{
  "email": "email válido",
  "password": "string"
}

    Descrição: Realiza autenticação e retorna um token JWT.

🔸 Atualizar Usuário

    PATCH /usuarios/:id

    Body:

{
  "nome": "string (opcional)",
  "celular": "string (opcional)",
  "email": "email válido (opcional)",
  "tipo": "musico | contratante | admin (opcional)",
  "cidade": "string (opcional)",
  "estado": "string (opcional)",
  "generos": ["string", "string"] (opcional),
  "instrumentos": ["string", "string"] (opcional),
  "biografia": "string (opcional)",
  "avatar": "string (opcional)",
  "midias": [
    {
      "tipo": "video | imagem",
      "url": "string"
    }
  ] (opcional)
}

    Descrição: Atualiza dados do usuário, incluindo mídias, instrumentos e gêneros.

🔸 Redefinir Senha

    POST /usuarios/:id/redefinir-senha

    Body:

{
  "novaSenha": "string",
  "confirmacaoSenha": "string"
}

    Descrição: Atualiza a senha do usuário. A senha e a confirmação devem ser iguais.

🔐 Enumerações
✔️ Status do Carrinho

    aberto

    finalizado

    cancelado

✔️ Tipo de Usuário

    musico

    contratante

    admin

✔️ Tipo de Mídia

    video

    imagem

🔗 Relacionamentos
Entidade	Relacionamento	Descrição
Usuario	Carrinho (1:N)	Um usuário pode ter vários carrinhos
Carrinho	ItemCarrinho (1:N)	Um carrinho possui vários itens
ItemCarrinho	Produto (N:1)	Cada item pertence a um produto
📑 Validações Importantes

    UUIDs: Verificados em campos como usuarioId, produtoId, carrinhoId.

    E-mails: Validados no formato correto.

    Quantidade: Deve ser inteiro e mínimo de 1.

    Status e Enumerações: Verificação de valores válidos (status, tipo, midias).

    URLs: Apenas URLs válidas são aceitas para imagens e mídias.

🚀 Possíveis Extensões Futuras

    ✅ Rate limiting

    ✅ Logs de alterações no carrinho

    ✅ Histórico de pedidos (quando o carrinho for finalizado)

    ✅ Sistema de pagamentos integrado
