# QualiteApps Bot Shop API

## Configuração

1. Crie um arquivo `.env` com as seguintes variáveis:
```
MP_ACCESS_TOKEN=seu_token_de_acesso_mercadopago
MP_PUBLIC_KEY=sua_chave_pública_mercadopago
DISCORD_TOKEN=seu_token_do_bot_discord
SQUARE_API_KEY=sua_chave_api_squarecloud
BASE_URL=sua_url_base
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm start
```

## Endpoints da API

### `GET /api/bots`
Retorna todos os bots vinculados ao usuário autenticado.

### `POST /api/bots`
Cria uma nova instância de bot.
```json
{
  "name": "Nome do Bot",
  "token": "Token do Bot do Discord",
  "plan": "epro|ticket"
}
```

### `GET /api/bots/:id`
Retorna informações sobre um bot específico.

### `DELETE /api/bots/:id`
Exclui uma instância de bot.

## Autenticação

Todos os endpoints exigem um token do Discord válido no cabeçalho de autorização:
```
Authorization: Bearer <discord_token>
```