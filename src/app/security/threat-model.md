# Modelagem de Ameaças (Threat Model — STRIDE) — Fisio-Elite

## 1. Ativos Críticos
1. **Dados Clínicos & Pacientes**: Escalas de avaliação, gasometrias, calculadoras de UTI, dados de funcionalidade (CIF/CIAP2).
2. **Prompts e Respostas da FisioIA**: Consultas interativas de apoio à decisão clínica.
3. **Credenciais & Sessões**: Tokens HttpOnly, sessões de usuário e permissões RBAC/ABAC.
4. **Integridade dos Algoritmos Clínicos**: Cálculos determinísticos de SOFA, ROX, HACOR, Glasgow, Gasometria.

## 2. Fronteiras de Confiança (Trust Boundaries)
- **Fronteira 1**: Navegador (Frontend React) ↔ Backend API / BFF (HTTPS).
- **Fronteira 2**: Backend API ↔ Banco de Dados (SSL/TLS interno, credenciais isoladas).
- **Fronteira 3**: Backend API ↔ Provider de IA / LLM (AI Gateway com sanitização e Structured Output Validation).

## 3. Matriz STRIDE de Riscos e Mitigações

| Ameaça STRIDE | Ativo Afetado | Risco Mapeado | Controle de Segurança Implementado |
| :--- | :--- | :--- | :--- |
| **Spoofing** (Falsificação) | Autenticação / Usuários | Roubo de identidade / Session Fixation | Auth no backend via Cookies HttpOnly, SameSite=Strict, Secure, PKCE |
| **Tampering** (Adulteração) | Calculadoras Clínicas / API | Injeção de valores inválidos / payload malformado | Validação Zod estrita no client & re-validação obrigatória no server |
| **Repudiation** (Repúdio) | Auditoria de Operações | Falta de rastreabilidade de ações críticas | Audit Trail no backend com Timestamp, UserID, Action, RequestID |
| **Information Disclosure** (Vazamento) | Dados de Saúde / Logs | Exposição de dados de saúde em logs/storage | Minimização LGPD, sanitização em logger, no clinical data em localStorage |
| **Denial of Service** (Negação de Serviço) | API / FisioIA Gateway | Exaustão de recursos por requisições em massa | Rate limiting por IP/User na API e no AI Gateway |
| **Elevation of Privilege** (Elevação de Privilégio) | Autorização RBAC/ABAC | Acesso não autorizado a rotas administrativas | Autorização verificada no backend a cada request (`patient.read`, etc.) |

## 4. Requisitos OWASP ASVS & LGPD Mapeados
- **ASVS V2**: Autenticação Robusta (Sessões HttpOnly, renovação e logout seguro).
- **ASVS V5**: Validação e Sanitização de Entradas (Zod + DOMPurify contra XSS).
- **ASVS V14**: Configuração de Segurança (CSP restritiva sem `unsafe-eval`, HSTS, X-Content-Type-Options).
- **LGPD**: Criptografia em trânsito e repouso, princípio da minimização e direito de exclusão/exportação.
