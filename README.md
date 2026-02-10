# 🚀 Client Hub - André Silva WebDev

Portal profissional de gestão de projetos, desenvolvido para centralizar a comunicação, monitorização de progresso e pagamentos entre o desenvolvedor e o cliente.

## 🛠️ Tech Stack
* **Framework:** Next.js 14+ (App Router)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS + Lucide Icons
* **Base de Dados & Auth:** Google Firebase (Firestore)
* **Pagamentos:** Stripe API
* **Deployment:** Vercel

---

## 📋 Funcionalidades

### 🔐 Áreas de Acesso
* **Portal do Cliente:** Acesso simplificado via e-mail. Visualização de progresso, galeria de updates (prints do projeto) e chat direto.
* **Painel Administrativo:** Gestão total de projetos, criação de novos contratos, atualização de progresso e envio de orçamentos.

### 💰 Gestão de Pagamentos
* Integração direta com **Stripe**.
* Suporte para pagamentos de Adjudicação (50%) e Liquidação Total (100%).
* Métodos de pagamento: Cartão de Crédito e Multibanco.
* Redirecionamento inteligente e página de sucesso personalizada.

### 💬 Comunicação e Feedback
* Sistema de chat interno para centralizar pedidos de alteração e aprovações.
* Galeria de acompanhamento visual do desenvolvimento em tempo real.

---

## ⚙️ Configuração de Ambiente

Para rodar este projeto, configura as seguintes variáveis de ambiente no teu `.env.local` ou no painel da Vercel:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Stripe Configuration
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# App Configuration
NEXT_PUBLIC_URL=[https://clienthub.andresilvawebdev.pt](https://clienthub.andresilvawebdev.pt)
