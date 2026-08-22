# Plano de Arquitetura, Segurança, Qualidade Clínica, UI/UX e Produção — Fisio-Elite

## 1. Objetivo

Modernizar a plataforma **Fisio-Elite** para uma aplicação web de nível de produção, com foco em:

* segurança;
* robustez;
* confiabilidade clínica;
* escalabilidade;
* acessibilidade;
* desempenho;
* manutenção;
* rastreabilidade;
* observabilidade;
* privacidade;
* experiência do usuário.

A aplicação será estruturada como uma **PWA/SPA moderna**, utilizando **React + TypeScript no frontend** e **Supabase como plataforma principal de backend gerenciado**, incluindo:

* PostgreSQL;
* autenticação;
* Row Level Security;
* Storage;
* Edge Functions;
* Realtime quando necessário;
* migrations;
* integração com serviços externos.

A arquitetura adotará um modelo híbrido:

```text
Operações comuns autorizadas por RLS
→ React ↔ Supabase

Operações privilegiadas ou sensíveis
→ React → Edge Function/API → Supabase

FisioIA
→ React → AI Gateway server-side → LLM
```

O frontend nunca será considerado uma fronteira de segurança.

---

# 2. Princípios Arquiteturais

A plataforma seguirá:

* Defense in Depth;
* Zero Trust entre cliente e servidor;
* Secure by Default;
* Privacy by Design;
* Least Privilege;
* Separation of Concerns;
* Domain-Driven Design pragmático;
* Fail Secure;
* Accessibility by Default;
* Server-side Authorization;
* Database-level Authorization;
* Data Minimization.

Uma regra fundamental da arquitetura será:

> A interface pode decidir o que mostrar, mas nunca será responsável por decidir o que o usuário realmente pode acessar.

---

# 3. Stack Principal

## Frontend

* React 19;
* TypeScript strict;
* Vite;
* React Router;
* Tailwind CSS;
* Radix UI;
* shadcn/ui;
* Lucide Icons;
* CSS Custom Properties;
* React Hook Form;
* Zod;
* TanStack Query;
* Zustand;
* Vitest;
* Testing Library;
* Playwright;
* axe-core.

## Backend gerenciado

### Supabase

Utilizar como plataforma principal para:

* PostgreSQL;
* Supabase Auth;
* Row Level Security — RLS;
* Storage;
* Edge Functions;
* migrations;
* database functions quando apropriado;
* Realtime quando houver necessidade real.

## Serviços externos

Poderão existir integrações com:

* provedores de IA;
* serviços de e-mail;
* serviços de monitoramento;
* analytics;
* notificações;
* serviços administrativos.

Nenhum secret desses serviços deverá ser exposto no navegador.

---

# 4. Arquitetura Geral

```text
┌────────────────────────────────────────────┐
│                FRONTEND PWA                │
│                                            │
│ React                                      │
│ TypeScript                                 │
│ React Router                               │
│ TanStack Query                             │
│ React Hook Form                            │
│ Zod                                        │
│ Zustand                                    │
│ Radix / shadcn                             │
└─────────────────────┬──────────────────────┘
                      │
                    HTTPS
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌─────────────────┐       ┌────────────────────┐
│ Supabase Client │       │ Edge Functions/API │
│                 │       │                    │
│ Auth            │       │ Operações críticas│
│ RLS-protected   │       │ Secrets            │
│ queries         │       │ Integrações        │
└────────┬────────┘       │ FisioIA Gateway    │
         │                └─────────┬──────────┘
         │                          │
         └──────────────┬───────────┘
                        ▼
              ┌────────────────────┐
              │ Supabase           │
              │ PostgreSQL         │
              │                    │
              │ RLS                │
              │ Constraints        │
              │ Functions          │
              │ Audit              │
              │ Clinical Data      │
              └─────────┬──────────┘
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
      ┌─────────────┐       ┌──────────────┐
      │   Storage   │       │ Observability│
      │             │       │              │
      │ Documents   │       │ Errors       │
      │ Attachments │       │ Metrics      │
      │ Images      │       │ Traces       │
      └─────────────┘       │ Logs         │
                            └──────────────┘
```

---

# 5. Modelo de Segurança Supabase

O Supabase será utilizado com uma abordagem **deny by default**.

A existência de uma API gerada automaticamente pelo Supabase não significa que todas as tabelas devam ser diretamente acessíveis pelo navegador.

Cada recurso deverá ser classificado como:

```text
Público
│
├── acesso direto permitido
│
└── sem informações sensíveis

Autenticado
│
├── Supabase Auth
└── RLS obrigatória

Sensível
│
├── RLS rigorosa
├── políticas por organização/usuário
└── acesso mínimo necessário

Privilegiado
│
└── somente Edge Function/API server-side
```

---

# 6. Regra Obrigatória de RLS

Todas as tabelas contendo dados privados deverão possuir **Row Level Security habilitada antes de entrarem em produção**.

Isso inclui principalmente:

* pacientes;
* avaliações;
* prontuários;
* resultados;
* registros clínicos;
* usuários;
* clínicas;
* permissões;
* documentos;
* histórico;
* dados relacionados ao FisioIA.

Regra:

> Nenhuma tabela privada poderá ser liberada em produção sem RLS, policies explícitas e testes automatizados de autorização.

---

# 7. Modelo Multiusuário e Multiclínica

A arquitetura deverá suportar isolamento entre organizações.

Exemplo:

```text
organization
     │
     ├── users
     ├── professionals
     ├── patients
     ├── assessments
     └── clinical_records
```

Estrutura conceitual:

```text
Usuário autenticado
        ↓
organization_members
        ↓
organization_id
        ↓
RLS
        ↓
Somente dados da organização autorizada
```

Nunca confiar somente em algo como:

```typescript
.eq("organization_id", currentOrganizationId)
```

no frontend.

A política do banco deverá verificar a autorização independentemente do filtro enviado pelo cliente.

---

# 8. Supabase Auth

O Supabase Auth será o mecanismo principal de identidade.

Responsabilidades:

* login;
* logout;
* sessões;
* recuperação de conta;
* identificação segura do usuário;
* integração com políticas RLS.

O identificador de autenticação deverá ser relacionado a uma tabela de perfil da aplicação.

Exemplo:

```text
auth.users
    │
    ▼
profiles
    │
    ├── display_name
    ├── professional_data
    ├── status
    └── application_metadata
```

Dados específicos da aplicação não deverão ser concentrados desnecessariamente na tabela interna de autenticação.

---

# 9. RBAC + RLS

A aplicação utilizará uma combinação de:

* RBAC — Role-Based Access Control;
* RLS — Row Level Security;
* ABAC quando necessário.

Exemplo de papéis:

```text
owner
administrator
supervisor
physiotherapist
intern
viewer
```

Entretanto, a aplicação deverá evitar depender exclusivamente do nome do papel.

Preferir permissões como:

```text
patient.read
patient.create
patient.update
patient.delete

assessment.create
assessment.read

clinical_history.read

ai.use

users.read
users.manage

audit.read
```

Fluxo:

```text
User
 ↓
Membership
 ↓
Role
 ↓
Permissions
 ↓
RLS / Backend Policy
 ↓
Resource
```

---

# 10. Service Role

A credencial privilegiada do Supabase deverá ser considerada um **secret de infraestrutura**.

Ela:

* nunca poderá aparecer no frontend;
* nunca poderá ser incorporada ao bundle Vite;
* nunca poderá ser armazenada em código público;
* nunca poderá ser enviada ao navegador.

Seu uso deverá ficar restrito a ambientes server-side devidamente protegidos.

---

# 11. Supabase Client no Frontend

O cliente Supabase ficará centralizado.

```text
src/
└── shared/
    └── api/
        ├── supabase.client.ts
        └── queryKeys.ts
```

Chamadas ao banco não deverão ficar espalhadas pelos componentes React.

Evitar:

```typescript
function PatientCard() {
  supabase
    .from("patients")
    .select("*");
}
```

Preferir:

```text
modules/
└── patients/
    ├── api/
    │   └── patients.repository.ts
    │
    ├── domain/
    ├── schemas/
    └── ui/
```

Fluxo:

```text
UI
 ↓
TanStack Query
 ↓
Repository
 ↓
Supabase Client
 ↓
RLS
 ↓
PostgreSQL
```

---

# 12. Estrutura Frontend

```text
src/

├── app/
│   ├── router/
│   ├── providers/
│   ├── config/
│   ├── styles/
│   ├── errors/
│   └── security/
│
├── shared/
│   ├── ui/
│   ├── api/
│   │   ├── supabase.client.ts
│   │   ├── queryClient.ts
│   │   └── errors.ts
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   ├── schemas/
│   └── accessibility/
│
├── features/
│   ├── authentication/
│   ├── authorization/
│   ├── organizations/
│   ├── search/
│   ├── theme/
│   ├── accessibility/
│   ├── profile/
│   └── notifications/
│
├── modules/
│   ├── patients/
│   ├── gasometria/
│   ├── sofa/
│   ├── rox/
│   ├── hacor/
│   ├── glasgow/
│   ├── mrc/
│   ├── perme/
│   ├── rass/
│   ├── cam-icu/
│   ├── cif/
│   ├── ciap2/
│   ├── fisioia/
│   └── flashcards/
│
├── pages/
│
├── tests/
│   ├── e2e/
│   ├── security/
│   ├── authorization/
│   ├── rls/
│   ├── a11y/
│   ├── integration/
│   └── clinical-fixtures/
│
└── main.tsx
```

---

# 13. Estrutura Supabase

Versionar toda a configuração importante no projeto.

```text
supabase/

├── migrations/
├── functions/
│   ├── fisioia/
│   ├── reports/
│   └── integrations/
│
├── tests/
│   ├── rls/
│   └── database/
│
└── seed/
```

Evitar alterações manuais em produção que não estejam representadas por migrations versionadas.

---

# 14. Database Migrations

Toda alteração de banco deverá ser versionada.

Isso inclui:

* tabelas;
* colunas;
* índices;
* constraints;
* triggers;
* functions;
* RLS;
* policies.

Fluxo recomendado:

```text
Development
    ↓
Migration
    ↓
Code Review
    ↓
Automated Tests
    ↓
Staging
    ↓
Production
```

---

# 15. PostgreSQL como Camada de Integridade

Não depender exclusivamente de Zod para garantir integridade.

Utilizar no PostgreSQL:

* `NOT NULL`;
* `CHECK`;
* `UNIQUE`;
* `FOREIGN KEY`;
* índices;
* constraints;
* transações.

Arquitetura:

```text
Frontend Zod
    ↓
UX

Backend validation
    ↓
Security

PostgreSQL constraints
    ↓
Data integrity
```

---

# 16. Estado da Aplicação

## TanStack Query

Será responsável pelo estado de servidor:

* pacientes;
* resultados;
* avaliações;
* histórico;
* usuários;
* APIs;
* Supabase;
* FisioIA;
* sincronização;
* cache.

## Zustand

Somente para estado local:

* tema;
* preferências;
* estados temporários;
* UI.

## React Hook Form + Zod

Responsáveis por formulários e validação no cliente.

---

# 17. TypeScript

Ativar configurações rigorosas:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "useUnknownInCatchVariables": true
  }
}
```

Também utilizar:

* ESLint;
* Prettier;
* lint de acessibilidade;
* regras de React Hooks;
* prevenção de APIs inseguras;
* proibição de `eval`;
* restrição a `dangerouslySetInnerHTML`.

---

# 18. Design System

Implementar com:

* Tailwind CSS;
* Radix UI;
* shadcn/ui;
* CSS Custom Properties;
* design tokens.

Centralizar:

* cores;
* tipografia;
* espaçamentos;
* border radius;
* sombras;
* motion;
* breakpoints;
* z-index.

Temas:

* claro;
* escuro;
* alto contraste.

---

# 19. Acessibilidade

Objetivo formal:

> **WCAG 2.2 AA**

Implementar:

* HTML semântico;
* landmarks;
* labels;
* navegação por teclado;
* focus management;
* foco visível;
* skip links;
* contraste;
* suporte a zoom;
* leitores de tela;
* mensagens de erro acessíveis;
* tamanho adequado de targets.

Respeitar:

```text
prefers-reduced-motion
prefers-color-scheme
```

A `AccessibilityToolbar` será um recurso adicional, não um requisito para utilizar a aplicação.

---

# 20. Arquitetura Clínica

A lógica clínica ficará independente de:

* React;
* Supabase;
* banco;
* APIs;
* localStorage.

Exemplo:

```text
modules/
└── sofa/
    ├── domain/
    │   ├── calculateSofa.ts
    │   ├── interpretSofa.ts
    │   └── sofa.types.ts
    │
    ├── schemas/
    │   └── sofa.schema.ts
    │
    ├── metadata/
    │   └── sofa.metadata.ts
    │
    ├── api/
    │   └── sofa.repository.ts
    │
    ├── ui/
    │   ├── SofaForm.tsx
    │   └── SofaResult.tsx
    │
    └── tests/
        └── calculateSofa.test.ts
```

Fluxo:

```text
Dados
 ↓
Zod
 ↓
Domain Function
 ↓
Resultado
 ↓
Persistência opcional no Supabase
```

---

# 21. Rastreabilidade Clínica

Toda calculadora terá:

* identificador;
* versão;
* versão da fórmula;
* referência;
* unidades;
* limites;
* data de revisão;
* responsável pela revisão quando aplicável.

Exemplo:

```typescript
{
  id: "rox-index",
  version: "1.2.0",
  formulaVersion: "original",
  reviewedAt: "YYYY-MM-DD",
  references: [],
  units: {},
  limits: {}
}
```

---

# 22. Testes Clínicos

Implementar:

* unit tests;
* Golden Tests;
* boundary testing;
* regression testing;
* property-based testing quando apropriado;
* mutation testing para regras críticas.

```text
tests/
└── clinical-fixtures/
    ├── sofa.json
    ├── rox.json
    ├── hacor.json
    ├── glasgow.json
    ├── mrc.json
    └── perme.json
```

---

# 23. Segurança das Policies RLS

As policies deverão ser tratadas como código de segurança.

Criar testes para provar simultaneamente que:

```text
Usuário autorizado
→ consegue acessar

Usuário não autorizado
→ não consegue acessar

Usuário de outra organização
→ não consegue acessar

Usuário deslogado
→ não consegue acessar

Usuário com papel insuficiente
→ não consegue alterar
```

Testar tanto `SELECT` quanto:

* INSERT;
* UPDATE;
* DELETE.

---

# 24. Testes Negativos de Autorização

Não testar apenas caminhos permitidos.

Exemplos obrigatórios:

```text
Fisioterapeuta A
→ tenta acessar paciente da clínica B
→ NEGADO

Estagiário
→ tenta excluir paciente
→ NEGADO

Usuário desativado
→ tenta consultar registros
→ NEGADO

Usuário comum
→ tenta alterar permissões
→ NEGADO
```

Esses testes deverão fazer parte do CI.

---

# 25. Edge Functions

Utilizar Edge Functions/API server-side para operações como:

* FisioIA;
* comunicação com LLM;
* uso de secrets;
* integrações externas;
* webhooks;
* geração de relatórios protegidos;
* processos administrativos;
* operações com privilégios elevados;
* tarefas que não devem ser executadas diretamente pelo cliente.

Antes de executar a operação:

```text
Request
 ↓
Authentication
 ↓
Authorization
 ↓
Schema validation
 ↓
Business policy
 ↓
Operation
 ↓
Audit
 ↓
Response
```

---

# 26. FisioIA

O FisioIA obrigatoriamente passará por uma camada server-side.

Nunca:

```text
React
→ API do LLM
```

Utilizar:

```text
React
 ↓
Supabase Edge Function / AI Gateway
 ↓
Authentication
 ↓
Authorization
 ↓
Privacy Filter
 ↓
Context Builder
 ↓
LLM Provider
 ↓
Structured Output
 ↓
Schema Validation
 ↓
Clinical / Security Policy
 ↓
React
```

Secrets de IA permanecerão exclusivamente no servidor.

---

# 27. Prompt Injection

Não considerar “sanitização de prompt” como mecanismo suficiente de proteção.

O modelo:

* não controla permissões;
* não consulta dados arbitrariamente;
* não determina sozinho quais pacientes pode acessar;
* não executa operações privilegiadas sem autorização externa.

Caso o LLM solicite:

```text
getPatient(123)
```

o servidor deverá verificar:

```text
Quem é o usuário?
        ↓
Qual sua organização?
        ↓
Possui permissão?
        ↓
Pode acessar o paciente 123?
        ↓
Sim → executar
Não → negar
```

---

# 28. Structured Outputs

Respostas da IA deverão, sempre que possível, utilizar contratos estruturados.

Exemplo:

```typescript
const FisioIAResponseSchema = z.object({
  summary: z.string(),
  alerts: z.array(z.string()),
  references: z.array(z.string()),
  confidence: z.number().min(0).max(1)
});
```

O conteúdo será validado antes de retornar para a interface.

---

# 29. Supabase Storage

Storage poderá ser utilizado para:

* documentos;
* imagens;
* anexos;
* arquivos relacionados ao atendimento.

Buckets contendo informações privadas deverão ser privados.

O acesso deverá ocorrer por políticas apropriadas.

Não utilizar URLs públicas permanentes para documentos clínicos privados.

Implementar política de:

* upload;
* download;
* exclusão;
* limite de tamanho;
* tipos MIME;
* permissões;
* retenção.

---

# 30. Upload de Arquivos

Uploads deverão ser tratados como entrada não confiável.

Validar:

* tamanho;
* extensão;
* MIME type;
* autorização;
* nome de arquivo;
* localização de armazenamento.

Quando aplicável, prever mecanismo de análise de arquivos potencialmente maliciosos antes de disponibilizá-los a outros usuários.

---

# 31. Realtime

Supabase Realtime somente será habilitado quando houver benefício real.

Possíveis usos:

* atualização de status;
* notificações;
* colaboração;
* atualização de dashboards.

Evitar Realtime indiscriminado sobre tabelas clínicas.

Toda assinatura deverá respeitar as políticas de autorização correspondentes.

---

# 32. LGPD e Dados de Saúde

A arquitetura será construída com **Privacy by Design**.

Implementar:

* minimização de dados;
* limitação de finalidade;
* controle de acesso;
* retenção;
* exclusão;
* exportação;
* rastreabilidade;
* registros de acesso;
* políticas de incidente;
* backups;
* segregação de dados.

Dados clínicos não deverão ser enviados desnecessariamente para:

* error trackers;
* analytics;
* logs;
* sistemas de IA;
* serviços externos.

A adoção do Supabase não torna automaticamente o projeto compatível com a LGPD.

Aspectos jurídicos, contratuais e operacionais deverão ser avaliados separadamente.

---

# 33. Logs e Dados Sensíveis

Evitar:

```typescript
console.log(patient);
console.log(user);
console.log(aiPrompt);
```

Implementar redaction para campos sensíveis.

Nunca registrar:

* senhas;
* tokens;
* secrets;
* session cookies;
* dados clínicos completos sem necessidade;
* conteúdo integral de prontuários indiscriminadamente.

---

# 34. Audit Trail

Eventos sensíveis deverão gerar registros de auditoria.

Exemplo:

```text
actor_id
organization_id
action
resource_type
resource_id
timestamp
request_id
result
```

Eventos:

* login;
* alteração de permissões;
* acesso administrativo;
* edição;
* exclusão;
* alterações clínicas relevantes;
* exportações;
* determinadas ações do FisioIA.

O audit log deverá ser protegido contra alteração por usuários comuns.

---

# 35. XSS

Utilizar comportamento seguro padrão do React.

```tsx
<div>{userInput}</div>
```

DOMPurify somente quando houver necessidade legítima de renderizar HTML não confiável.

```text
Texto
→ React escaping

Markdown
→ parser seguro

HTML externo
→ DOMPurify

dangerouslySetInnerHTML
→ proibido por padrão
```

---

# 36. Content Security Policy

Aplicar:

* Content-Security-Policy;
* Strict-Transport-Security;
* X-Content-Type-Options;
* Referrer-Policy;
* Permissions-Policy.

Restringir:

```text
default-src
script-src
style-src
img-src
font-src
connect-src
frame-ancestors
object-src
base-uri
form-action
```

Evitar `unsafe-eval`.

Avaliar Trusted Types.

---

# 37. Secrets e Variáveis de Ambiente

Qualquer variável incorporada ao bundle frontend deve ser tratada como pública.

Não armazenar no React:

```text
SUPABASE_SERVICE_ROLE_KEY
LLM_API_KEY
DATABASE_PASSWORD
JWT_SECRET
EMAIL_SERVICE_SECRET
```

Secrets deverão permanecer em:

```text
Edge Functions
Backend
Secret manager
Infraestrutura
```

---

# 38. PWA e Supabase

Não utilizar Service Worker para cache indiscriminado das respostas do Supabase.

## Permitido

* JS;
* CSS;
* fontes;
* imagens estáticas;
* assets.

## Evitar cache persistente

* pacientes;
* avaliações;
* prontuários;
* respostas privadas da IA;
* dados autenticados;
* sessões;
* tokens.

---

# 39. Offline

Caso seja necessário suportar funcionamento clínico offline, criar um projeto específico para isso.

Analisar:

* IndexedDB;
* criptografia;
* chaves;
* expiração;
* logout;
* perda do dispositivo;
* sincronização;
* conflitos;
* exclusão;
* revogação.

Não ativar persistência offline de dados clínicos apenas por conveniência.

---

# 40. Tratamento de Erros

Criar estratégia padronizada.

Frontend:

* Error Boundary;
* 401;
* 403;
* 404;
* 409;
* 422;
* 429;
* 500;
* timeout;
* network error;
* offline.

A interface não deverá expor erros internos do Supabase diretamente ao usuário.

Normalizar:

```typescript
type AppError = {
  code: string;
  message: string;
  requestId?: string;
};
```

---

# 41. Observabilidade

Implementar:

* error monitoring;
* métricas;
* structured logging;
* tracing;
* health checks;
* request IDs;
* alertas.

Deverá existir sanitização antes de enviar informações para sistemas de observabilidade.

---

# 42. Segurança de Dependências

Implementar:

* `pnpm audit`;
* Dependabot ou Renovate;
* CodeQL ou Semgrep;
* Gitleaks;
* lockfile;
* SBOM;
* revisão de dependências.

Também revisar dependências introduzidas por componentes shadcn instalados no código do projeto.

---

# 43. OWASP

Utilizar como referência:

* OWASP Top 10;
* OWASP API Security Top 10;
* OWASP ASVS;
* OWASP Cheat Sheet Series.

O **OWASP ASVS** será utilizado como checklist de requisitos.

---

# 44. Threat Modeling

Executar análise STRIDE principalmente sobre:

```text
Browser
  ↓
Supabase Auth
  ↓
RLS
  ↓
PostgreSQL

Browser
  ↓
Edge Function
  ↓
LLM

Browser
  ↓
Storage

Organizations
  ↓
Data isolation
```

Para cada ameaça:

```text
Threat
 ↓
Impact
 ↓
Probability
 ↓
Mitigation
 ↓
Automated/Manual Test
```

---

# 45. Ambientes Supabase

Separar claramente:

```text
development
staging
production
```

Nunca compartilhar entre ambientes:

* banco;
* secrets;
* credenciais;
* Storage;
* usuários reais;
* dados clínicos reais.

Staging deverá ser próximo da produção, mas utilizar dados anonimizados ou sintéticos.

---

# 46. Seed de Desenvolvimento

Utilizar somente:

* pacientes fictícios;
* dados sintéticos;
* identidades falsas;
* documentos simulados.

Dados reais não deverão ser copiados indiscriminadamente para desenvolvimento.

---

# 47. Backups

Definir estratégia explícita para:

* backups;
* retenção;
* restauração;
* validação;
* disaster recovery.

Não basta existir backup.

Deverão ocorrer testes de restauração.

Regra:

> Backup não testado não pode ser considerado estratégia válida de recuperação.

---

# 48. Performance

Aplicar:

* lazy loading;
* code splitting;
* route splitting;
* bundle analysis;
* otimização de imagens;
* compressão;
* paginação;
* queries seletivas.

Evitar:

```typescript
.select("*")
```

quando apenas alguns campos forem necessários.

Selecionar apenas dados utilizados pela interface.

---

# 49. Índices no PostgreSQL

Adicionar índices conforme os padrões reais de acesso.

Exemplos potenciais:

```text
organization_id
patient_id
professional_id
created_at
status
```

Queries utilizadas pelas policies RLS também deverão ser avaliadas quanto a performance.

Segurança e performance das policies precisam coexistir.

---

# 50. CI/CD

Pipeline:

```text
Pull Request
      │
      ▼
Install Locked Dependencies
      │
      ▼
TypeScript
      │
      ▼
ESLint
      │
      ▼
Unit Tests
      │
      ▼
Clinical Golden Tests
      │
      ▼
Database Tests
      │
      ▼
RLS Authorization Tests
      │
      ▼
A11y
      │
      ▼
Security Tests
      │
      ▼
SAST
      │
      ▼
Dependency Scan
      │
      ▼
Secret Scan
      │
      ▼
Build
      │
      ▼
E2E
      │
      ▼
Staging
      │
      ▼
Smoke Tests
      │
      ▼
Production
```

---

# 51. Critérios para Falha do Build

Bloquear deploy quando houver:

* erro TypeScript;
* lint crítico;
* teste clínico quebrado;
* Golden Test quebrado;
* teste RLS quebrado;
* teste de autorização quebrado;
* secret detectado;
* vulnerabilidade crítica conforme política;
* falha de build;
* falha E2E crítica.

---

# 52. Fases de Implementação

## Fase 0 — Requisitos, Dados e Threat Modeling

* [x] mapear funcionalidades;
* [x] identificar dados sensíveis;
* [x] definir organizações;
* [x] definir usuários;
* [x] definir papéis;
* [x] definir permissões;
* [x] identificar fronteiras de confiança;
* [x] executar STRIDE;
* [x] definir requisitos ASVS;
* [x] definir requisitos LGPD;
* [x] mapear riscos clínicos.

---

## Fase 1 — Base React

* [x] React;
* [x] Vite;
* [x] TypeScript strict;
* [x] React Router;
* [x] ESLint;
* [x] Prettier;
* [x] aliases;
* [x] Error Boundary;
* [x] estrutura modular.

---

## Fase 2 — Supabase Foundation

* [x] criar ambientes;
* [x] configurar projeto;
* [x] integrar Supabase Client;
* [x] configurar migrations;
* [x] configurar Auth;
* [x] criar profiles;
* [x] criar organizations;
* [x] criar memberships;
* [x] estruturar RBAC.

---

## Fase 3 — Database Security

* [x] habilitar RLS;
* [x] criar policies;
* [x] implementar constraints;
* [x] definir foreign keys;
* [x] criar índices;
* [x] criar testes RLS;
* [x] testar isolamento entre organizações.

---

## Fase 4 — Design System

* [x] Tailwind;
* [x] Radix;
* [x] shadcn;
* [x] tokens;
* [x] dark mode;
* [x] light mode;
* [x] high contrast;
* [x] responsividade.

---

## Fase 5 — Formulários e Estado

* [x] React Hook Form;
* [x] Zod;
* [x] TanStack Query;
* [x] Zustand;
* [x] repositories;
* [x] error normalization.

---

## Fase 6 — Domain Layer Clínico

* [x] Gasometria;
* [x] ROX;
* [x] Glasgow;
* [x] SOFA;
* [x] HACOR;
* [x] PERME;
* [x] MRC;
* [x] RASS;
* [x] CAM-ICU.

Para cada módulo:

* [x] domain function;
* [x] schemas;
* [x] metadata;
* [x] unidades;
* [x] referências;
* [x] versão.

---

## Fase 7 — Qualidade Clínica

* [x] unit tests;
* [x] Golden Tests;
* [x] boundary tests;
* [x] regression tests;
* [x] revisão clínica;
* [x] documentação.

---

## Fase 8 — Pacientes e Dados Clínicos

* [x] schema de pacientes;
* [x] avaliações;
* [x] histórico;
* [x] RLS;
* [x] repositories;
* [x] audit trail;
* [x] validação de isolamento entre organizações.

---

## Fase 9 — Autenticação e Autorização

* [x] login;
* [x] logout;
* [x] recuperação;
* [x] sessão;
* [x] roles;
* [x] permissions;
* [x] RLS;
* [x] testes negativos;
* [x] auditoria.

---

## Fase 10 — Storage

* [ ] buckets privados;
* [ ] policies;
* [ ] upload;
* [ ] download;
* [ ] exclusão;
* [ ] limites;
* [ ] MIME validation;
* [ ] auditoria.

---

## Fase 11 — Edge Functions

* [x] autenticação;
* [x] autorização;
* [x] schemas;
* [x] secrets;
* [x] error handling;
* [x] rate limiting quando aplicável;
* [x] logs sanitizados.

---

## Fase 12 — FisioIA

* [x] AI Gateway;
* [x] Edge Function;
* [x] authorization layer;
* [x] privacy filter;
* [x] context builder;
* [x] provider abstraction;
* [x] structured output;
* [x] schemas;
* [x] guardrails;
* [x] tool authorization;
* [x] auditoria.

---

## Fase 13 — Segurança Web

* [x] CSP;
* [x] HSTS;
* [x] Referrer-Policy;
* [x] Permissions-Policy;
* [x] X-Content-Type-Options;
* [x] XSS controls;
* [x] Trusted Types quando adequado;
* [x] secret scanning;
* [x] SAST;
* [x] dependency scanning;
* [x] SBOM.

---

## Fase 14 — Acessibilidade

* [x] WCAG 2.2 AA;
* [x] teclado;
* [x] foco;
* [x] leitores de tela;
* [x] contraste;
* [x] reduced motion;
* [x] axe;
* [ ] Playwright;
* [x] testes manuais.

---

## Fase 15 — PWA

* [x] manifest;
* [x] service worker;
* [x] cache estático;
* [x] política de atualização;
* [x] offline seguro;
* [x] proteção contra persistência indevida de dados sensíveis.

---

## Fase 16 — Observabilidade

* [ ] error tracking;
* [ ] logs;
* [ ] redaction;
* [ ] métricas;
* [ ] tracing;
* [ ] health checks;
* [ ] alertas.

---

## Fase 17 — CI/CD

* [ ] lint;
* [ ] typecheck;
* [ ] unit;
* [ ] clinical;
* [ ] database tests;
* [ ] RLS tests;
* [ ] authorization tests;
* [ ] a11y;
* [ ] E2E;
* [ ] SAST;
* [ ] secret scanning;
* [ ] staging;
* [ ] produção.

---

## Fase 18 — Hardening

* [ ] revisão OWASP ASVS;
* [ ] DAST;
* [ ] pentest;
* [ ] revisar policies RLS;
* [ ] revisar Storage;
* [ ] revisar Edge Functions;
* [ ] revisar service role;
* [ ] revisar logs;
* [ ] revisar secrets;
* [ ] revisar permissões;
* [ ] revisar integração com IA.

---

## Fase 19 — Produção

* [ ] testes clínicos finais;
* [ ] testes de carga;
* [ ] testes de acessibilidade;
* [ ] restore test;
* [ ] disaster recovery;
* [ ] rollback;
* [ ] incident response;
* [ ] monitoramento;
* [ ] documentação operacional.

---

# 53. Regras Inegociáveis

## Regra 1

```text
Frontend ≠ fronteira de segurança
```

## Regra 2

```text
Tabela privada
→ RLS obrigatória
```

## Regra 3

```text
RLS
→ teste automatizado obrigatório
```

## Regra 4

```text
Service Role
→ nunca no navegador
```

## Regra 5

```text
LLM
→ sempre atrás de Edge Function/API
```

## Regra 6

```text
Lógica clínica
→ independente do React e Supabase
```

## Regra 7

```text
Dados clínicos
→ mínimo necessário
```

## Regra 8

```text
Operação privilegiada
→ autorização server-side
```

## Regra 9

```text
Logs
→ sem secrets e sem exposição desnecessária de dados clínicos
```

## Regra 10

```text
Migration + RLS + código
→ versionados juntos
```

---

# 54. Arquitetura Final Recomendada

```text
                     FISIO-ELITE

                         │
                         ▼

              React 19 + TypeScript
                         │
           ┌─────────────┴────────────┐
           │                          │
           ▼                          ▼
    React Hook Form            TanStack Query
         + Zod                        │
                                      ▼
                               Repository Layer
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
            Supabase Client                     Edge Functions
                    │                                   │
                    ▼                                   ▼
               Supabase Auth                      Authorization
                    │                                   │
                    ▼                                   ▼
                   RLS                             AI Gateway
                    │                                   │
                    ▼                                   ▼
             PostgreSQL                          LLM Provider
                    │
          ┌─────────┼───────────┐
          │         │           │
          ▼         ▼           ▼
       Clinical   Audit       Storage
        Data       Log
```

---

# 55. Resultado Esperado

Com essa arquitetura, o Supabase não será usado apenas como um banco acessado diretamente pelo frontend.

Ele se torna parte de uma arquitetura de segurança em camadas:

```text
Identidade
   ↓
Supabase Auth
   ↓
Autorização
   ↓
RLS
   ↓
PostgreSQL Constraints
   ↓
Audit
```

Para operações privilegiadas:

```text
React
   ↓
Edge Function
   ↓
Authentication
   ↓
Authorization
   ↓
Validation
   ↓
Business Rule
   ↓
Supabase
```

Para FisioIA:

```text
React
   ↓
Edge Function / AI Gateway
   ↓
Authorization
   ↓
Privacy Filtering
   ↓
Context
   ↓
LLM
   ↓
Structured Validation
   ↓
Clinical Policy
   ↓
React
```

Para calculadoras:

```text
Input
   ↓
Zod
   ↓
Pure Clinical Domain
   ↓
Interpretation
   ↓
Clinical Metadata
   ↓
Optional Persistence
   ↓
Supabase
```

A combinação **React + TypeScript + Supabase + PostgreSQL + RLS + Edge Functions + TanStack Query + Zod**, utilizada dessa maneira, fornece à Fisio-Elite uma base moderna, segura, altamente produtiva e preparada para crescimento, sem transferir responsabilidades críticas de segurança para o navegador.
