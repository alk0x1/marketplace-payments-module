# Marketplace Payments Module

Módulo de pagamentos com escrow para marketplace de serviços.

## Requisitos

- Node.js 20+
- pnpm
- Docker e Docker Compose

## Setup

1. Clone o repositório e instale as dependências:

```bash
pnpm install
```

2. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

3. Suba os containers (PostgreSQL e Redis):

```bash
docker-compose up -d
```

4. Execute as migrations do Prisma:

```bash
pnpm exec prisma migrate dev
```

5. Inicie o servidor:

```bash
pnpm start:dev
```

## Scripts

```bash
pnpm start:dev    # desenvolvimento com watch
pnpm build        # build de produção
pnpm start:prod   # rodar build de produção
pnpm test         # rodar testes
pnpm test:cov     # testes com cobertura
pnpm lint         # lint com biome
pnpm format       # formatar código
```

## API Docs

Swagger disponível em `http://localhost:3000/docs`

## Variáveis de Ambiente

| Variável | Descrição | Default |
|----------|-----------|---------|
| PORT | Porta do servidor | 3000 |
| DATABASE_URL | URL de conexão PostgreSQL | - |
| REDIS_HOST | Host do Redis | localhost |
| REDIS_PORT | Porta do Redis | 6379 |
| IUGU_API_TOKEN | Token da API Iugu | - |
| IUGU_ACCOUNT_ID | ID da conta Iugu | - |
| IUGU_TEST_MODE | Modo de teste Iugu | true |
| PLATFORM_FEE_PERCENT | Taxa da plataforma (%) | 10 |
| AUTO_CONFIRM_DAYS | Dias para auto-confirmação | 7 |
