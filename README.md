# 🤝 Plataforma de Gestão de Networking - Synapse

> Documento de Arquitetura Técnica - Plataforma de Gestão para Grupos de Networking

---

## 📋 Índice

- [Diagrama da Arquitetura](#-diagrama-da-arquitetura)
- [Modelo de Dados](#-modelo-de-dados)
- [Estrutura de Componentes](#-estrutura-de-componentes)
- [Definição da API REST](#-definição-da-api-rest)

---

## 🏗️ Diagrama da Arquitetura

A arquitetura proposta utiliza **React e NestJs** como stack do projeto, aproveitando o os componentes do shadCN ui e tailwind para facilitar o desenvolvimento da ui. Esta abordagem simplifica o desenvolvimento, o deploy e a manutenção.

### Componentes Principais

| Componente                           | Descrição                                                                                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend (ReactJs)**               | Interface do usuário construída em React com o Tanstack Router. Responsável por renderizar páginas públicas (formulário de intenção), área de membros e painel administrativo. |
| **Backend API (NestJs)** | Camada de API RESTful construída diretamente no NestJs. Lida com lógica de negócios, validação de dados e comunicação com BD.                                            |
| **Banco de Dados (PostgreSQL)**      | Banco de dados relacional para armazenar todos os dados da aplicação, garantindo integridade e relatórios complexos.                                                      |
| **Serviço de Email**                 | Serviço como Resend ou SendGrid, integrado via API, para envio de e-mails transacionais (no mvp apenas usando a Saida do terminal para os teste).                                                                                  |

### Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ARQUITETURA DA APLICAÇÃO                           │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┏━━━━━━━━━━━━━━━┓
                              ┃  👤 USUÁRIO   ┃
                              ┃   (Browser)   ┃
                              ┗━━━━┳━━━━━━━━━━┛
                                   │
                                   │ Acessa
                                   ▼
                    ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
                    ┃ 🖥️  FRONTEND            ┃
                    ┃ React 18+               ┃
                    ┃ Vite + Tailwind CSS     ┃
                    ┗━━━━┳━━━━━━━━━━━━━━━━━━━━┛
                         │
                         │ Requisições HTTP/HTTPS (REST API)
                         ▼
        ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
        ┃  ⚙️  BACKEND API               ┃
        ┃  NestJS                        ┃
        ┃  (Lógica de Negócios)          ┃
        ┗━━━┳━━━━━━━━━━━━━━━━━━━┳━━━━━━━┛
            │                   │
     Leitura│ Escrita     Envio │
            │                   │
            ▼                   ▼
    ┌───────────────┐    ┌────────────────────┐
    │  🗄️  BD       │    │  📧 Serviço Email  │
    │  PostgreSQL   │    │  Resend/SendGrid   │
    │  TypeORM      │    │                    │
    │               │    │ • Convites         │
    │ • User        │    │ • Notificações     │
    │ • Application │    │ • Avisos           │
    │ • Referral    │    └────────────────────┘
    │ • ThankYou    │
    │ • Meeting     │
    │ • Payment     │
    └───────────────┘

```

> **Fluxo de Dados:**
>
> 1. 👤 Usuário acessa a aplicação via browser
> 2. 🖥️ Frontend (React + Vite) renderiza as páginas com Tailwind CSS
> 3. 🖥️ Frontend comunica com a API Backend via HTTP REST
> 4. ⚙️ Backend (NestJS) gerencia dados no PostgreSQL via TypeORM
> 5. ⚙️ API envia e-mails via Resend/SendGrid

---

## 💾 Modelo de Dados

### Escolha do Banco de Dados: PostgreSQL

#### Justificativa

Embora o MongoDB seja flexível, a natureza dos dados desta plataforma é **altamente relacional**:

- ✅ Membros estão ligados a indicações
- ✅ Indicações estão ligadas a "obrigados"
- ✅ Membros estão ligados a pagamentos e presença em reuniões

Um banco de dados SQL como o **PostgreSQL** é a escolha ideal para:

- Garantir integridade referencial (via chaves estrangeiras)
- Facilitar consultas complexas (JOINs para relatórios e dashboards)
- Escalar de forma robusta e previsível

### Esquema do Banco de Dados

#### Tabelas Principais#### Tabelas Principais

<details>
<summary><b>👤 User (Usuários - Membros e Administradores)</b></summary>

```sql
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "company" TEXT,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'MEMBER', -- MEMBER, ADMIN
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_INVITE', -- PENDING_INVITE, ACTIVE, INACTIVE
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

</details>

<details>
<summary><b>📝 Application (Formulário de Intenção)</b></summary>

```sql
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "reason" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("reviewedById") REFERENCES "User"("id")
);
```

</details>

<details>
<summary><b>🎫 Invite (Convites de Cadastro)</b></summary>

```sql
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING', -- PENDING, COMPLETED
    "applicationId" TEXT NOT NULL,
    FOREIGN KEY ("applicationId") REFERENCES "Application"("id")
);
```

</details>

<details>
<summary><b>🤝 Referral (Indicações e Referências de Negócios)</b></summary>

```sql
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromMemberId" TEXT NOT NULL,
    "toMemberId" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT,
    "company" TEXT,
    "description" TEXT NOT NULL,
    "status" "ReferralStatus" NOT NULL DEFAULT 'SENT', -- SENT, NEGOTIATING, CLOSED, REJECTED
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("fromMemberId") REFERENCES "User"("id"),
    FOREIGN KEY ("toMemberId") REFERENCES "User"("id")
);
```

</details>

<details>
<summary><b>🎁 ThankYou (Registro de Obrigados/Negócios Fechados)</b></summary>

```sql
CREATE TABLE "ThankYou" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromMemberId" TEXT NOT NULL,
    "toMemberId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10, 2),
    "referralId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("fromMemberId") REFERENCES "User"("id"),
    FOREIGN KEY ("toMemberId") REFERENCES "User"("id"),
    FOREIGN KEY ("referralId") REFERENCES "Referral"("id")
);
```

</details>

<details>
<summary><b>☕ OneOnOneMeeting (Reuniões 1 a 1)</b></summary>

```sql
CREATE TABLE "OneOnOneMeeting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "member1Id" TEXT NOT NULL,
    "member2Id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("member1Id") REFERENCES "User"("id"),
    FOREIGN KEY ("member2Id") REFERENCES "User"("id")
);
```

</details>

<details>
<summary><b>💳 MembershipPayment (Controle de Mensalidades)</b></summary>

```sql
CREATE TABLE "MembershipPayment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "amount" DECIMAL(10, 2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING', -- PENDING, PAID, OVERDUE
    FOREIGN KEY ("memberId") REFERENCES "User"("id")
);
```

</details>

<details>
<summary><b>📢 Announcement (Avisos e Comunicados)</b></summary>

```sql
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("authorId") REFERENCES "User"("id")
);
```

</details>

<details>
<summary><b>📅 Meeting & MeetingAttendance (Reuniões e Presença)</b></summary>

```sql
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "MeetingAttendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("memberId") REFERENCES "User"("id"),
    FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id")
);
```

## </details>

## 📁 Estrutura de Componentes (Frontend)

A estrutura de pastas do frontend será organizada para otimizar a manutenção, reutilização e a lógica do React com Vite.

```
frontend/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.tsx                    # Página inicial / Formulário de Intenção
│   │   │   └── Register.tsx                # Página de Cadastro (com token)
│   │   ├── admin/
│   │   │   ├── AdminLayout.tsx             # Layout do Painel Admin
│   │   │   ├── Applications.tsx            # Gestão de intenções
│   │   │   └── Dashboard.tsx               # Dashboard administrativo
│   │   ├── member/
│   │   │   ├── MemberLayout.tsx            # Layout da Área de Membro
│   │   │   ├── Dashboard.tsx               # Dashboard de performance
│   │   │   ├── Referrals.tsx               # Listagem de indicações
│   │   │   ├── CreateReferral.tsx          # Criar nova indicação
│   │   │   └── Announcements.tsx           # Avisos
│   │   └── NotFound.tsx
│   │
│   ├── components/
│   │   ├── ui/                             # Componentes atômicos (reutilizáveis)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Badge.tsx
│   │   ├── features/                       # Componentes complexos (lógica negócio)
│   │   │   ├── ApplicationForm.tsx         # Formulário público de intenção
│   │   │   ├── ApplicationListAdmin.tsx    # Tabela de intenções (admin)
│   │   │   ├── ReferralForm.tsx            # Formulário de indicação
│   │   │   └── MemberReferrals.tsx         # Tabela de indicações (membro)
│   │   └── layout/                         # Componentes de estrutura
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   │
│   ├── hooks/                              # Custom Hooks
│   │   ├── useAuth.ts
│   │   ├── useApplications.ts
│   │   ├── useReferrals.ts
│   │   └── useUser.ts
│   │
│   ├── context/                            # Context API para estado global
│   │   ├── AuthContext.tsx
│   │   └── UserContext.tsx
│   │
│   ├── services/                           # Serviços de API
│   │   ├── api.ts                          # Configuração do Axios/Fetch
│   │   ├── authService.ts
│   │   ├── applicationService.ts
│   │   ├── referralService.ts
│   │   └── userService.ts
│   │
│   ├── styles/
│   │   ├── globals.css                     # Estilos globais com Tailwind
│   │   └── index.css
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.ts
│   │   └── entities.ts
│   │
│   ├── App.tsx                             # Componente raiz
│   ├── main.tsx                            # Ponto de entrada
│   └── router.tsx                          # Configuração de rotas (React Router)
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

---

## 🏗️ Estrutura do Backend (NestJS + TypeORM)

A estrutura do backend será organizada em módulos seguindo a arquitetura do NestJS com controllers, services e entities.

```
backend/src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts          # Endpoints de autenticação
│   │   ├── auth.service.ts             # Lógica de auth e JWT
│   │   ├── jwt.strategy.ts             # Estratégia JWT Passport
│   │   ├── jwt-auth.guard.ts           # Guard para rotas protegidas
│   │   └── auth.module.ts
│   │
│   ├── users/
│   │   ├── entities/
│   │   │   └── user.entity.ts          # Entidade User (TypeORM)
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── applications/
│   │   ├── entities/
│   │   │   ├── application.entity.ts
│   │   │   └── invite.entity.ts
│   │   ├── applications.controller.ts
│   │   ├── applications.service.ts
│   │   ├── dto/
│   │   │   ├── create-application.dto.ts
│   │   │   └── approve-application.dto.ts
│   │   └── applications.module.ts
│   │
│   ├── referrals/
│   │   ├── entities/
│   │   │   ├── referral.entity.ts
│   │   │   └── thank-you.entity.ts
│   │   ├── referrals.controller.ts
│   │   ├── referrals.service.ts
│   │   ├── dto/
│   │   │   ├── create-referral.dto.ts
│   │   │   └── update-referral.dto.ts
│   │   └── referrals.module.ts
│   │
│   ├── payments/
│   │   ├── entities/
│   │   │   └── membership-payment.entity.ts
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   └── payments.module.ts
│   │
│   ├── meetings/
│   │   ├── entities/
│   │   │   ├── meeting.entity.ts
│   │   │   └── meeting-attendance.entity.ts
│   │   ├── meetings.controller.ts
│   │   ├── meetings.service.ts
│   │   └── meetings.module.ts
│   │
│   └── announcements/
│       ├── entities/
│       │   └── announcement.entity.ts
│       ├── announcements.controller.ts
│       ├── announcements.service.ts
│       └── announcements.module.ts
│
├── database/
│   ├── config/
│   │   └── typeorm.config.ts           # Configuração do TypeORM
│   └── migrations/
│       └── [timestamps]_*.ts
│
├── common/
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   ├── guards/
│   │   └── roles.guard.ts
│   ├── interceptors/
│   │   └── logging.interceptor.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   └── pipes/
│       └── validation.pipe.ts
│
├── app.module.ts                       # Módulo raiz
├── app.controller.ts
├── app.service.ts
└── main.ts                             # Ponto de entrada
```

---

## 🔌 Definição da API REST

Abaixo estão as definições dos principais endpoints da API, seguindo o padrão REST.

### 🚀 Fluxo de Admissão (Obrigatório)

#### 1️⃣ Submeter Formulário de Intenção

**Endpoint:** `POST /api/applications`

**Descrição:** Cria um novo registro de intenção de participação.

<details>
<summary>Clique para expandir</summary>

**Request Body:**

```json
{
  "name": "Ana Silva",
  "email": "ana.silva@empresa.com",
  "company": "Empresa X",
  "reason": "Gostaria de expandir meu networking."
}
```

**Response (201 - Created):**

```json
{
  "id": "cl-app-123",
  "name": "Ana Silva",
  "email": "ana.silva@empresa.com",
  "status": "PENDING"
}
```

</details>

---

#### 2️⃣ Admin: Listar Todas as Intenções

**Endpoint:** `GET /api/admin/applications`

**Descrição:** Retorna a lista de todas as intenções pendentes e processadas. _(Rota protegida)_

<details>
<summary>Clique para expandir</summary>

**Response (200 - OK):**

```json
[
  {
    "id": "cl-app-123",
    "name": "Ana Silva",
    "email": "ana.silva@empresa.com",
    "company": "Empresa X",
    "reason": "Gostaria de expandir meu networking.",
    "status": "PENDING",
    "createdAt": "2023-10-27T10:00:00Z"
  }
]
```

</details>

---

#### 3️⃣ Admin: Aprovar Intenção

**Endpoint:** `POST /api/admin/applications/[id]/approve`

**Descrição:** Marca uma intenção como "APROVADA" e gera um Invite com token único. _(Rota protegida)_

<details>
<summary>Clique para expandir</summary>

**Response (200 - OK):**

```json
{
  "applicationId": "cl-app-123",
  "status": "APPROVED",
  "invite": {
    "id": "cl-invite-456",
    "email": "ana.silva@empresa.com",
    "token": "a1b2c3d4e5f6-token-unico-jwt-ou-uuid",
    "expiresAt": "2023-11-03T10:00:00Z"
  }
}
```

> 📧 O backend então envia um e-mail com o link `/register/[token]`

</details>

---

### 🤝 Sistema de Indicações (Opção A)

#### 4️⃣ Membro: Criar Nova Indicação

**Endpoint:** `POST /api/referrals`

**Descrição:** Um membro logado cria uma indicação para outro membro. _(Rota protegida)_

<details>
<summary>Clique para expandir</summary>

**Request Body:**

```json
{
  "toMemberId": "cl-user-789",
  "contactName": "Carlos Pereira",
  "contactEmail": "carlos@outraempresa.com",
  "company": "Outra Empresa Y",
  "description": "Buscam serviço de consultoria."
}
```

**Response (201 - Created):**

```json
{
  "id": "cl-ref-001",
  "fromMemberId": "cl-user-meu-id",
  "toMemberId": "cl-user-789",
  "status": "SENT",
  "createdAt": "2023-10-27T11:00:00Z"
}
```

</details>

---

#### 5️⃣ Membro: Atualizar Status de Indicação Recebida

**Endpoint:** `PATCH /api/referrals/[id]`

**Descrição:** O membro que recebeu a indicação atualiza seu status. _(Rota protegida)_

<details>
<summary>Clique para expandir</summary>

**Request Body:**

```json
{
  "status": "NEGOTIATING"
}
```

**Response (200 - OK):**

```json
{
  "id": "cl-ref-001",
  "status": "NEGOTIATING",
  "updatedAt": "2023-10-28T09:30:00Z"
}
```

</details>

---

## 📚 Resumo da Stack

| Categoria          | Tecnologia                                               |
| ------------------ | -------------------------------------------------------- |
| **Frontend**       | React 18+, TypeScript, Vite                              |
| **Styling**        | Tailwind CSS, PostCSS                                    |
| **Roteamento**     | React Router v6+                                         |
| **HTTP Client**    | Axios ou Fetch API                                       |
| **Estado Global**  | Context API ou Zustand                                   |
| **Backend**        | NestJS (TypeScript Framework)                            |
| **Banco de Dados** | PostgreSQL                                               |
| **ORM**            | TypeORM                                                  |
| **Validação**      | Class Validator, Class Transformer                       |
| **Email**          | Resend ou SendGrid                                       |
| **Auth**           | JWT (JSON Web Tokens)                                    |
| **Deploy**         | Docker, Vercel (Frontend), Heroku/DigitalOcean (Backend) |

---

## 🗂️ Estrutura do Projeto (Completa)

```
synapse/
├── frontend/                           # 🖥️ Aplicação React + Vite
│   ├── src/
│   ├── public/
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── package.json
│   └── ...
│
├── backend/                            # ⚙️ API NestJS
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── applications/
│   │   │   ├── referrals/
│   │   │   ├── payments/
│   │   │   ├── meetings/
│   │   │   └── announcements/
│   │   ├── database/
│   │   │   ├── entities/
│   │   │   └── migrations/
│   │   ├── common/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── .env.example
│   ├── ormconfig.json
│   ├── package.json
│   └── ...
│
└── README.md
```

---

**Última atualização:** Novembro 2025
