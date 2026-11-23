# ⚡ VoltPrime Elétrica 24h — Portal Corporativo Next.js 15

Portal corporativo nível diretor desenvolvido para operações de engenharia elétrica e pronto atendimento emergencial **24 horas** em **São José dos Campos e Vale do Paraíba**.

Construído em **Next.js 15 (App Router)**, **React 19**, **TypeScript estrito** e **Tailwind CSS**, com foco em conversão executiva, performance máxima no plano gratuito da Vercel e SEO técnico estruturado.

---

## 🎯 Funcionalidades Principais

1. **Header Fixo com Mega-Menu & Busca Instantânea em Tempo Real**
   - Mega-Menu corporativo categorizado (Emergências 24h, Residencial & Corporativo e atalho direto de SLA).
   - Barra de busca instantânea que filtra o catálogo por palavra-chave, norma técnica ou categoria em tempo real, com atalho `ESC` e drawer mobile.
2. **Hero Cinematográfico + Prova Social Executiva**
   - Destaque para atendimento emergencial em até **35 minutos**, selo **+320 Avaliações 5.0 Estrelas**, conformidade **CREA-SP / NR-10 / NBR 5410** e card visual `16:10` com telemetria operacional.
3. **Simulador Interativo de Chamado Urgente 24h (`EmergencySimulator.tsx`)**
   - **Passo 1:** Tipo de problema (Queda de disjuntor/Curto-circuito, Quadro QDC completo, Padrão de entrada EDP, Instalação 220V/Ar-condicionado, Tomadas/Iluminação e Laudo NR-10).
   - **Passo 2:** Bairro/Cidade (Jardim Aquarius, Urbanova, Vila Ema, Jardim Satélite, Centro SJC, Taubaté e Jacareí) com cálculo realista de chegada.
   - **Passo 3:** Nível de urgência (Emergência Imediata 24h, Agendado Hoje ou Orçamento Programado) + observação técnica opcional.
   - **Resultado Dinâmico:** Protocolo de triagem, previsão de chegada, faixa transparente de atendimento, botão **Copiar Resumo Técnico** e botão **Enviar no WhatsApp 24h** com briefing formatado.
4. **Catálogo Completo de Serviços em Cards**
   - Filtro por categoria (`Todos`, `Emergência 24h`, `Residencial`, `Comercial/Industrial`) integrado à busca do Header.
   - Badges de garantia, tempo médio, especificações técnicas e pré-seleção direta no Simulador 24h.
5. **Seção Engenharia & Segurança NR-10 com Imagens 4:3 e Fallback Resiliente**
   - Utiliza `<img>` padrão para `/images/hero-eletricista.jpg`, `/images/eletricista-epi.jpg` e `/images/painel-industrial.jpg`, com fallback visual executivo automático caso alguma imagem ainda não esteja presente.
6. **Cobertura Regional & FAQ Interativo em Acordeão**
   - Lista de bairros e cidades do Vale do Paraíba com ETA médio + perguntas frequentes acessíveis (`aria-expanded` / `aria-controls`).
7. **SEO Técnico & Dados Estruturados (Schema.org)**
   - Metadata completa no `layout.tsx` (OpenGraph, Twitter Cards, Canonical, Robots, Viewport) + JSON-LD (`Electrician` / `LocalBusiness` 24/7 com `aggregateRating` 5.0).

---

## 🛠️ Stack Tecnológica

| Tecnologia | Função |
| --- | --- |
| **Next.js 15.2 (App Router)** | Renderização híbrida, SEO e roteamento moderno |
| **React 19** | Interface interativa e estado reativo |
| **TypeScript 5.8 (Strict)** | Tipagem rigorosa sem `any`, com `noUnusedLocals` e `noUnusedParameters` |
| **Tailwind CSS 3.4** | Estética grafite escuro (`#0A0D12`), cartões `#121721` e âmbar elétrico (`#F59E0B`) |
| **lucide-react** | Iconografia vetorial leve e consistente |
| **next/font/google** | Carregamento otimizado de `Plus Jakarta Sans` e `JetBrains Mono` |

---

## 📂 Estrutura de Pastas

```text
voltprime-eletrica-24h-nextjs/
├── public/
│   └── images/
│       ├── hero-eletricista.jpg      # Foto principal do Hero (16:9 / 16:10)
│       ├── eletricista-epi.jpg       # Foto da seção Engenharia & NR-10 (4:3)
│       └── painel-industrial.jpg     # Foto de Painéis & Termografia (4:3)
├── src/
│   ├── app/
│   │   ├── globals.css               # Estilos globais, tema grafite e scrollbar customizada
│   │   ├── layout.tsx                # Fontes Google, Metadata SEO e JSON-LD Schema.org
│   │   └── page.tsx                  # Entry point Server Component
│   └── components/
│       ├── EmergencySimulator.tsx    # Simulador interativo 3 passos + WhatsApp/Clipboard
│       └── PortalClient.tsx          # Header, Mega-Menu, Busca, Hero, Catálogo, FAQ e Footer
├── .eslintrc.json                    # Regras ESLint Next.js 15 sem bloqueio de <img>
├── next.config.ts
├── package.json
├── postcss.config.mjs                # Pipeline PostCSS + Tailwind CSS
├── tailwind.config.ts
├── tsconfig.json
└── README.md
