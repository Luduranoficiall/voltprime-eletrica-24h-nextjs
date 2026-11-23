"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Cpu,
  ExternalLink,
  FileCheck2,
  Flame,
  Gauge,
  Home,
  Lock,
  MapPin,
  Menu,
  MessageSquare,
  PhoneCall,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import EmergencySimulator, {
  ProblemId,
  SimulatorTrigger,
} from "./EmergencySimulator";

type ServiceCategory =
  | "Todos"
  | "Emergência 24h"
  | "Residencial"
  | "Comercial/Industrial";

interface ElectricalService {
  id: string;
  title: string;
  category: Exclude<ServiceCategory, "Todos">;
  summary: string;
  warranty: string;
  avgTime: string;
  simulatorLink: ProblemId;
  highlights: string[];
  keywords: string[];
  featured?: boolean;
}

interface CoverageArea {
  name: string;
  region: string;
  eta: string;
  type: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tag: string;
}

const WHATSAPP_DIRECT =
  "https://wa.me/5512991002400?text=Ol%C3%A1%20VoltPrime%20El%C3%A9trica%2024h!%20Preciso%20de%20atendimento%20t%C3%A9cnico%20em%20S%C3%A3o%20Jos%C3%A9%20dos%20Campos%20%2F%20Vale%20do%20Para%C3%ADba.";

const SERVICES_CATALOG: ElectricalService[] = [
  {
    id: "emergencia-curto-circuito",
    title: "Atendimento Emergencial de Curto-Circuito e Sobrecarga",
    category: "Emergência 24h",
    summary:
      "Localização precisa de falhas ocultas com termografia infravermelha, reestabelecimento seguro de energia e substituição imediata de disjuntores danificados.",
    warranty: "Garantia 12 meses",
    avgTime: "45 min a 2h",
    simulatorLink: "curto-disjuntor",
    highlights: [
      "Chegada em até 35 min em SJC",
      "Análise termográfica de aquecimento",
      "Restauração segura sem quebra desnecessária",
    ],
    keywords: [
      "curto",
      "disjuntor",
      "queda de energia",
      "cheiro de queimado",
      "emergencia",
      "plantao",
      "urgente",
    ],
    featured: true,
  },
  {
    id: "falta-fase-condominio",
    title: "Restabelecimento de Fase e Disjuntor Geral de Condomínios",
    category: "Emergência 24h",
    summary:
      "Suporte imediato 24h para falta parcial de energia, desarme de disjuntor de entrada, falhas em bombas de recalque e quadros de medição coletivos.",
    warranty: "Garantia 12 meses",
    avgTime: "1h a 2h30",
    simulatorLink: "curto-disjuntor",
    highlights: [
      "Atendimento prioritário a síndicos",
      "Medição True-RMS de desequilíbrio",
      "Relatório técnico pós-ocorrência",
    ],
    keywords: [
      "condominio",
      "fase",
      "bomba",
      "elevador",
      "disjuntor geral",
      "sindico",
      "emergencia",
    ],
  },
  {
    id: "protecao-surtos-raios",
    title: "Diagnóstico Pós-Tempestade, Surtos e Proteção DPS",
    category: "Emergência 24h",
    summary:
      "Inspeção emergencial após descargas atmosféricas, restabelecimento de circuitos críticos e instalação de dispositivos de proteção contra surtos.",
    warranty: "Garantia 24 meses",
    avgTime: "1h a 3h",
    simulatorLink: "quadro-qdc",
    highlights: [
      "Proteção para eletrônicos e servidores",
      "DPS Classe I e II homologados",
      "Verificação completa do aterramento",
    ],
    keywords: ["raio", "tempestade", "dps", "surto", "queima", "protecao"],
  },
  {
    id: "quadro-qdc-nbr5410",
    title: "Montagem e Retrofit Completo de Quadro QDC (NBR 5410)",
    category: "Residencial",
    summary:
      "Reengenharia total de quadros antigos com barramento pente cobreado, identificação a laser de circuitos, interruptor diferencial residual (DR) e DPS.",
    warranty: "Garantia 24 meses",
    avgTime: "4h a 8h",
    simulatorLink: "quadro-qdc",
    highlights: [
      "Acabamento padrão engenharia",
      "Proteção contra choque elétrico (DR)",
      "Diagrama unifilar colado na porta",
    ],
    keywords: [
      "qdc",
      "quadro",
      "disjuntor",
      "dr",
      "dps",
      "reforma",
      "nbr 5410",
      "residencial",
    ],
    featured: true,
  },
  {
    id: "circuito-220v-ar-condicionado",
    title: "Circuito Dedicado 220V para Ar-Condicionado, Forno e Cooktop",
    category: "Residencial",
    summary:
      "Infraestrutura exclusiva dimensionada conforme potência nominal do equipamento, evitando sobrecargas, quedas de tensão e perda de garantia do fabricante.",
    warranty: "Garantia 18 meses",
    avgTime: "1h30 a 3h",
    simulatorLink: "instalacao-220v",
    highlights: [
      "Cabo cobre antichama certificado",
      "Disjuntor exclusivo no QDC",
      "Teste de carga e isolação",
    ],
    keywords: [
      "220v",
      "ar condicionado",
      "cooktop",
      "forno",
      "chuveiro",
      "circuito dedicado",
    ],
  },
  {
    id: "carregador-veicular-wallbox",
    title: "Instalação de Carregador Veicular (Wallbox) em Casas e Prédios",
    category: "Residencial",
    summary:
      "Projeto e instalação certificada para veículos elétricos e híbridos (BYD, Volvo, Tesla, BMW) com DR Tipo B/A, proteção DPS e ART para condomínios.",
    warranty: "Garantia 24 meses",
    avgTime: "3h a 5h",
    simulatorLink: "instalacao-220v",
    highlights: [
      "Emissão de ART exigida por condomínios",
      "Dimensionamento contra aquecimento contínuo",
      "Compatível com todas as montadoras",
    ],
    keywords: [
      "wallbox",
      "carro eletrico",
      "carregador veicular",
      "byd",
      "condominio",
      "art",
    ],
  },
  {
    id: "iluminacao-arquitetonica-tomadas",
    title: "Iluminação Arquitetônica LED, Perfis e Pontos de Tomada 20A",
    category: "Residencial",
    summary:
      "Execução limpa para residências de alto padrão: perfis de LED, automação Wi-Fi/Zigbee, luminárias técnicas e substituição completa de tomadas.",
    warranty: "Garantia 12 meses",
    avgTime: "1h a 4h",
    simulatorLink: "tomadas-iluminacao",
    highlights: [
      "Acabamento sem sujeira e proteção do piso",
      "Integração com Alexa e HomeKit",
      "Padronização de fase, neutro e terra",
    ],
    keywords: [
      "iluminacao",
      "led",
      "tomada",
      "lustre",
      "automacao",
      "perfil led",
      "interruptor",
    ],
  },
  {
    id: "padrao-entrada-edp",
    title: "Padrão de Entrada EDP, Aumento de Carga e Troca de Ramal",
    category: "Comercial/Industrial",
    summary:
      "Adequação completa conforme norma técnica da EDP São Paulo: migração monofásico para bifásico ou trifásico, postes, caixas de medição e aprovação.",
    warranty: "Garantia 24 meses",
    avgTime: "1 a 2 dias úteis",
    simulatorLink: "padrao-edp",
    highlights: [
      "Conformidade 100% com vistoria EDP-SP",
      "ART de execução e cálculo de demanda",
      "Redução de risco de reprovação",
    ],
    keywords: [
      "edp",
      "padrao",
      "aumento de carga",
      "trifasico",
      "bifasico",
      "relogio",
      "poste",
    ],
    featured: true,
  },
  {
    id: "laudo-nr10-termografia",
    title: "Laudo Técnico NR-10, Termografia e Prontuário Elétrico (PIE)",
    category: "Comercial/Industrial",
    summary:
      "Inspeção termográfica preventiva em painéis de força, relatório de não conformidades, análise de qualidade de energia e emissão de ART CREA-SP.",
    warranty: "ART CREA-SP",
    avgTime: "Vistoria 3h • Laudo 48h",
    simulatorLink: "laudo-nr10",
    highlights: [
      "Atende auditorias, seguradoras e Bombeiros",
      "Termovisor com certificado de calibração",
      "Plano de ação priorizado por criticidade",
    ],
    keywords: [
      "laudo",
      "nr10",
      "nr-10",
      "termografia",
      "art",
      "crea",
      "pie",
      "avcb",
      "empresa",
    ],
  },
  {
    id: "paineis-industriais-comandos",
    title: "Montagem e Manutenção de Painéis Industriais, QGBT e Comandos",
    category: "Comercial/Industrial",
    summary:
      "Manutenção corretiva e preventiva em quadros gerais de baixa tensão (QGBT), bancos de capacitores, partidas de motores, inversores e balanceamento de fases.",
    warranty: "Garantia 12 meses",
    avgTime: "Sob diagnóstico",
    simulatorLink: "laudo-nr10",
    highlights: [
      "Equipe habilitada NR-10 e NR-35",
      "Correção de fator de potência",
      "Atendimento fora do horário comercial",
    ],
    keywords: [
      "painel",
      "industrial",
      "qgbt",
      "motor",
      "inversor",
      "trifasico",
      "comercial",
      "fabrica",
    ],
  },
];

const COVERAGE_AREAS: CoverageArea[] = [
  {
    name: "Jardim Aquarius",
    region: "Zona Oeste • SJC",
    eta: "18–28 min",
    type: "Base Principal",
  },
  {
    name: "Urbanova",
    region: "Zona Oeste • SJC",
    eta: "22–35 min",
    type: "Condomínios",
  },
  {
    name: "Vila Ema & Vila Adyana",
    region: "Região Central • SJC",
    eta: "15–25 min",
    type: "Alta Prioridade",
  },
  {
    name: "Jardim Satélite & Bosque",
    region: "Zona Sul • SJC",
    eta: "20–32 min",
    type: "Unidade Sul",
  },
  {
    name: "Centro & São Dimas",
    region: "Eixo Corporativo • SJC",
    eta: "18–30 min",
    type: "Corporativo",
  },
  {
    name: "Jardim Esplanada & Colinas",
    region: "Zona Oeste • SJC",
    eta: "15–25 min",
    type: "Alto Padrão",
  },
  {
    name: "Jacareí",
    region: "Vale do Paraíba",
    eta: "30–45 min",
    type: "Via Dutra",
  },
  {
    name: "Taubaté & Caçapava",
    region: "Vale do Paraíba",
    eta: "35–55 min",
    type: "Eixo Industrial",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-tempo",
    tag: "Plantão 24h",
    question:
      "O atendimento de até 35 minutos realmente funciona de madrugada, domingos e feriados?",
    answer:
      "Sim. Mantemos unidades móveis escaladas em regime 24/7 com base estratégica no Jardim Aquarius e eixo central de São José dos Campos. Em chamadas críticas dentro da malha urbana de SJC, o tempo médio registrado é de 22 a 35 minutos, inclusive em madrugadas e feriados.",
  },
  {
    id: "faq-orcamento",
    tag: "Transparência",
    question:
      "Como funciona a cobrança e a aprovação do orçamento antes do serviço?",
    answer:
      "Nenhum serviço é executado sem sua aprovação expressa. No simulador você já visualiza a faixa transparente de referência. Ao chegar ao local, o técnico realiza o diagnóstico instrumentado, apresenta o valor fechado (mão de obra + eventual material) e somente inicia mediante seu aceite.",
  },
  {
    id: "faq-certificacao",
    tag: "Engenharia",
    question:
      "A VoltPrime emite Nota Fiscal, Garantia documentada e ART pelo CREA-SP?",
    answer:
      "Sim. Emitimos Nota Fiscal de Serviço (NFS-e) para pessoas físicas, condomínios e empresas, termo de garantia de 12 a 24 meses conforme o escopo, e ART registrada no CREA-SP para reformas de QDC, carregadores veiculares (Wallbox), padrões EDP e laudos NR-10.",
  },
  {
    id: "faq-materiais",
    tag: "Qualidade",
    question:
      "Os técnicos já levam disjuntores, cabos e componentes de reposição na viatura?",
    answer:
      "Nossas unidades móveis carregam estoque embarcado com componentes das principais linhas certificadas pelo INMETRO (Schneider Electric, ABB, Siemens, Steck e Prysmian), permitindo resolver mais de 85% das emergências na primeira visita sem atrasos.",
  },
  {
    id: "faq-condominio",
    tag: "Condomínios & Empresas",
    question:
      "Vocês atendem condomínios de alto padrão (Urbanova/Aquarius) e contratos recorrentes?",
    answer:
      "Sim. Possuímos toda a documentação de integração exigida por portarias e administradoras (NR-10, NR-35, ASO e seguro de responsabilidade civil), além de planos de manutenção preventiva mensal e SLA prioritário para condomínios, clínicas, restaurantes e galpões.",
  },
  {
    id: "faq-pagamento",
    tag: "Financeiro",
    question: "Quais formas de pagamento são aceitas no plantão e em projetos?",
    answer:
      "Aceitamos PIX, cartões de débito e crédito (com parcelamento em até 6x para projetos e reformas de QDC/padrão EDP), além de faturamento via boleto bancário para condomínios e empresas cadastradas.",
  },
];

interface ExecutiveImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  fallbackSubtitle: string;
  fallbackBadge: string;
  className?: string;
}

function ExecutiveImage({
  src,
  alt,
  fallbackTitle,
  fallbackSubtitle,
  fallbackBadge,
  className = "",
}: ExecutiveImageProps) {
  const [hasError, setHasError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setHasError(true);
    }
  }, [src]);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#171F2E] via-[#101520] to-[#0A0D12] p-6 ${className}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-executive-grid bg-grid-md opacity-60" />
        <div className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-300">
            <Zap className="h-3.5 w-3.5" />
            {fallbackBadge}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            CREA-SP • NR-10
          </span>
        </div>

        <div className="relative z-10 my-8 flex items-center justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-amber-500/30 bg-[#0A0D12]/80 shadow-volt-glow">
            <ShieldCheck className="h-11 w-11 text-amber-400" />
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-[#0A0D12]">
              <Zap className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        <div className="relative z-10 rounded-xl border border-white/10 bg-[#0A0D12]/75 p-4 backdrop-blur-md">
          <p className="text-sm font-bold text-white">{fallbackTitle}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            {fallbackSubtitle}
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
      loading="eager"
    />
  );
}

export default function PortalClient() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory>("Todos");
  const [megaMenuOpen, setMegaMenuOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [openFaqId, setOpenFaqId] = useState<string>(FAQ_ITEMS[0].id);
  const [simulatorTrigger, setSimulatorTrigger] =
    useState<SimulatorTrigger | null>(null);

  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const megaMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMegaMenuOpen(false);
        setSearchFocused(false);
        setMobileMenuOpen(false);
      }
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        setSearchFocused(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(target)) {
        setMegaMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const instantSearchResults = useMemo(() => {
    if (!normalizedQuery) return SERVICES_CATALOG.slice(0, 5);
    return SERVICES_CATALOG.filter((service) => {
      const haystack = [
        service.title,
        service.category,
        service.summary,
        ...service.keywords,
        ...service.highlights,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const filteredCatalog = useMemo(() => {
    return SERVICES_CATALOG.filter((service) => {
      const matchesCategory =
        selectedCategory === "Todos" || service.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;
      const haystack = [
        service.title,
        service.category,
        service.summary,
        ...service.keywords,
        ...service.highlights,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [selectedCategory, normalizedQuery]);

  function scrollToSection(sectionId: string) {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
    setSearchFocused(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleSelectCategoryAndScroll(category: ServiceCategory) {
    setSelectedCategory(category);
    scrollToSection("servicos");
  }

  function handleOpenInSimulator(problemId: ProblemId) {
    setSimulatorTrigger((prev) => ({
      problemId,
      seq: (prev?.seq ?? 0) + 1,
    }));
    scrollToSection("simulador");
  }

  function handleSelectSearchItem(service: ElectricalService) {
    setSelectedCategory(service.category);
    setSearchQuery(service.title.split(" ").slice(0, 3).join(" "));
    setSearchFocused(false);
    scrollToSection("servicos");
  }

  const categories: ServiceCategory[] = [
    "Todos",
    "Emergência 24h",
    "Residencial",
    "Comercial/Industrial",
  ];

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-100">
      {/* Top Executive Utility Bar */}
      <div className="hidden border-b border-white/[0.06] bg-[#07090D] text-xs text-slate-400 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-2 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Plantão 24h Ativo — São José dos Campos, Jacareí e Taubaté
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              Engenharia CREA-SP • NR-10 • NBR 5410
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1 text-amber-400">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              5.0 Estrelas (+320 avaliações verificadas)
            </span>
            <a
              href="tel:+5512991002400"
              className="font-mono font-semibold text-white transition hover:text-amber-400"
            >
              (12) 99100-2400
            </a>
          </div>
        </div>
      </div>

      {/* Fixed Header with Mega-Menu & Instant Search */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0A0D12]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <a
            href="#topo"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex shrink-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#0A0D12] shadow-lg shadow-amber-500/25">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <div className="leading-tight">
              <span className="block text-base font-extrabold tracking-tight text-white">
                VOLT<span className="text-amber-400">PRIME</span>
              </span>
              <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Elétrica 24h • SJC
              </span>
            </div>
          </a>

          {/* Desktop Navigation + Mega-Menu Trigger */}
          <nav
            aria-label="Navegação Principal"
            className="hidden items-center gap-1 lg:flex"
          >
            <div ref={megaMenuRef} className="relative">
              <button
                type="button"
                aria-expanded={megaMenuOpen}
                aria-controls="voltprime-megamenu"
                onClick={() => setMegaMenuOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                  megaMenuOpen
                    ? "bg-white/10 text-amber-400"
                    : "text-slate-200 hover:bg-white/5 hover:text-white"
                }`}
              >
                Serviços
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    megaMenuOpen ? "rotate-180 text-amber-400" : ""
                  }`}
                />
              </button>

              {/* Mega-Menu Panel */}
              {megaMenuOpen && (
                <div
                  id="voltprime-megamenu"
                  className="absolute left-0 top-full mt-3 w-[760px] rounded-2xl border border-white/10 bg-[#121721] p-6 shadow-2xl shadow-black/80"
                >
                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-4 space-y-3 border-r border-white/[0.07] pr-4">
                      <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-amber-400">
                        <Flame className="h-3.5 w-3.5" />
                        Emergências 24h
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenInSimulator("curto-disjuntor")
                            }
                            className="group flex w-full items-center justify-between rounded-lg p-2 text-left text-slate-200 transition hover:bg-white/5 hover:text-amber-300"
                          >
                            <span>Curto-circuito &amp; Disjuntor</span>
                            <ChevronRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectCategoryAndScroll("Emergência 24h")
                            }
                            className="group flex w-full items-center justify-between rounded-lg p-2 text-left text-slate-200 transition hover:bg-white/5 hover:text-amber-300"
                          >
                            <span>Falta de Fase &amp; Condomínios</span>
                            <ChevronRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectCategoryAndScroll("Emergência 24h")
                            }
                            className="group flex w-full items-center justify-between rounded-lg p-2 text-left text-slate-200 transition hover:bg-white/5 hover:text-amber-300"
                          >
                            <span>Proteção DPS Pós-Tempestade</span>
                            <ChevronRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                          </button>
                        </li>
                      </ul>
                    </div>

                    <div className="col-span-4 space-y-3 border-r border-white/[0.07] pr-4">
                      <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-amber-400">
                        <Home className="h-3.5 w-3.5" />
                        Residencial &amp; Corporativo
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <button
                            type="button"
                            onClick={() => handleOpenInSimulator("quadro-qdc")}
                            className="group flex w-full items-center justify-between rounded-lg p-2 text-left text-slate-200 transition hover:bg-white/5 hover:text-amber-300"
                          >
                            <span>Retrofit de Quadro QDC</span>
                            <ChevronRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenInSimulator("instalacao-220v")
                            }
                            className="group flex w-full items-center justify-between rounded-lg p-2 text-left text-slate-200 transition hover:bg-white/5 hover:text-amber-300"
                          >
                            <span>220V, Ar-Condicionado &amp; Wallbox</span>
                            <ChevronRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => handleOpenInSimulator("padrao-edp")}
                            className="group flex w-full items-center justify-between rounded-lg p-2 text-left text-slate-200 transition hover:bg-white/5 hover:text-amber-300"
                          >
                            <span>Padrão de Entrada EDP-SP</span>
                            <ChevronRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => handleOpenInSimulator("laudo-nr10")}
                            className="group flex w-full items-center justify-between rounded-lg p-2 text-left text-slate-200 transition hover:bg-white/5 hover:text-amber-300"
                          >
                            <span>Laudo NR-10 &amp; Termografia</span>
                            <ChevronRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                          </button>
                        </li>
                      </ul>
                    </div>

                    <div className="col-span-4 flex flex-col justify-between rounded-xl border border-amber-500/20 bg-[#0A0D12] p-4">
                      <div>
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-amber-300">
                          SLA Médio: 35 min
                        </span>
                        <h4 className="mt-2.5 text-sm font-bold text-white">
                          Precisa de Eletricista Agora?
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                          Simule o atendimento em 15 segundos e receba o resumo
                          pronto com previsão de chegada.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => scrollToSection("simulador")}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-3 py-2.5 text-xs font-extrabold text-[#0A0D12] transition hover:bg-amber-400"
                      >
                        Abrir Simulador 24h
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => scrollToSection("simulador")}
              className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Simulador 24h
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("engenharia")}
              className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Engenharia
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("cobertura")}
              className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Cobertura &amp; FAQ
            </button>
          </nav>

          {/* Instant Search Bar */}
          <div
            ref={searchContainerRef}
            className="relative hidden max-w-xs flex-1 md:block lg:max-w-sm"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                aria-label="Buscar serviço elétrico em tempo real"
                placeholder="Buscar: disjuntor, QDC, EDP, NR-10..."
                className="w-full rounded-xl border border-white/10 bg-[#121721] py-2.5 pl-10 pr-9 text-sm text-white placeholder-slate-400 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Limpar busca"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Real-Time Search Dropdown */}
            {searchFocused && (
              <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#121721] shadow-2xl shadow-black/90">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <span>
                    {normalizedQuery
                      ? `${instantSearchResults.length} resultado(s) em tempo real`
                      : "Serviços mais procurados"}
                  </span>
                  <span className="font-mono text-amber-400">ESC</span>
                </div>
                <div className="max-h-72 divide-y divide-white/[0.05] overflow-y-auto">
                  {instantSearchResults.length > 0 ? (
                    instantSearchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectSearchItem(item)}
                        className="flex w-full items-start justify-between gap-3 px-3.5 py-3 text-left transition hover:bg-white/[0.05]"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-400">
                            {item.category} • {item.avgTime}
                          </p>
                        </div>
                        <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      Nenhum serviço encontrado para &ldquo;{searchQuery}
                      &rdquo;.{" "}
                      <button
                        type="button"
                        onClick={() => scrollToSection("simulador")}
                        className="font-semibold text-amber-400 underline"
                      >
                        Simular atendimento personalizado
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            <a
              href={WHATSAPP_DIRECT}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-extrabold text-[#0A0D12] shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 sm:inline-flex"
            >
              <PhoneCall className="h-4 w-4" />
              Plantão 24h
            </a>
            <button
              type="button"
              aria-label="Abrir menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#121721] text-slate-200 lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer + Mobile Instant Search */}
        {mobileMenuOpen && (
          <div className="border-t border-white/[0.08] bg-[#121721] px-4 pb-6 pt-4 lg:hidden">
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Filtrar serviços: disjuntor, QDC, EDP..."
                className="w-full rounded-xl border border-white/10 bg-[#0A0D12] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => scrollToSection("simulador")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
              >
                Simulador de Chamado 24h
                <ChevronRight className="h-4 w-4 text-amber-400" />
              </button>
              <button
                type="button"
                onClick={() => handleSelectCategoryAndScroll("Todos")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
              >
                Catálogo Completo de Serviços
                <ChevronRight className="h-4 w-4 text-amber-400" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("engenharia")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
              >
                Padrão Engenharia &amp; NR-10
                <ChevronRight className="h-4 w-4 text-amber-400" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("cobertura")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
              >
                Cobertura Regional &amp; FAQ
                <ChevronRight className="h-4 w-4 text-amber-400" />
              </button>
            </div>

            <a
              href={WHATSAPP_DIRECT}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3.5 text-sm font-extrabold text-[#0A0D12]"
            >
              <MessageSquare className="h-4 w-4" />
              Acionar Plantão 24h via WhatsApp
            </a>
          </div>
        )}
      </header>

      <main id="topo">
        {/* Cinematic Executive Hero */}
        <section className="relative overflow-hidden pb-20 pt-12 lg:pb-28 lg:pt-20">
          <div className="pointer-events-none absolute inset-0 executive-radial" />
          <div className="pointer-events-none absolute inset-0 bg-executive-grid bg-grid-md opacity-40" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              {/* Hero Left Content */}
              <div className="lg:col-span-7">
                {/* Social Proof & SLA Pills */}
                <div className="mb-6 flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/35 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-300">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    Atendimento Emergencial em até 35 min
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#121721] px-3.5 py-1.5 text-xs font-semibold text-slate-200">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    +320 Avaliações 5.0 Estrelas
                  </span>
                </div>

                <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                  Engenharia Elétrica &amp;{" "}
                  <span className="volt-gradient-text">
                    Emergências 24 Horas
                  </span>{" "}
                  em São José dos Campos.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                  Operação técnica de alto padrão para residências, condomínios,
                  comércios e indústrias no Vale do Paraíba. Diagnóstico
                  termográfico preciso, conformidade total{" "}
                  <strong className="font-semibold text-white">
                    CREA-SP / NR-10 / NBR 5410
                  </strong>{" "}
                  e orçamento transparente antes da execução.
                </p>

                {/* Primary Hero CTAs */}
                <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => scrollToSection("simulador")}
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-amber-500 px-6 py-4 text-sm font-extrabold text-[#0A0D12] shadow-volt-glow transition hover:bg-amber-400"
                  >
                    <Zap className="h-4 w-4 fill-current" />
                    Simular Chamado Urgente 24h
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href={WHATSAPP_DIRECT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-[#121721] px-6 py-4 text-sm font-bold text-white transition hover:border-amber-500/50 hover:bg-[#171E2B]"
                  >
                    <PhoneCall className="h-4 w-4 text-amber-400" />
                    Falar Direto com Engenheiro de Plantão
                  </a>
                </div>

                {/* Credibility Badges Row */}
                <div className="mt-10 grid grid-cols-2 gap-4 border-t border-white/[0.08] pt-8 sm:grid-cols-4">
                  <div>
                    <p className="font-mono text-2xl font-extrabold text-white">
                      ≤ 35 min
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      SLA médio de chegada em SJC
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-2xl font-extrabold text-amber-400">
                      5.0 ★
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      +320 clientes avaliados no Google
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-2xl font-extrabold text-white">
                      CREA / NR-10
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Equipe certificada com ART
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-2xl font-extrabold text-white">
                      24/7
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Madrugadas, domingos e feriados
                    </p>
                  </div>
                </div>
              </div>

              {/* Hero Right Visual Card (16:10 Horizontal Framing + Telemetry Bar Below) */}
              <div className="lg:col-span-5">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#121721] shadow-card-dark">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#0A0D12]">
                    <ExecutiveImage
                      src="/images/hero-eletricista.jpg"
                      alt="Engenheiro eletricista VoltPrime 24h inspecionando painel elétrico em São José dos Campos"
                      fallbackBadge="Operação VoltPrime SJC"
                      fallbackTitle="Unidade Técnica Especializada 24h"
                      fallbackSubtitle="Diagnóstico termográfico Fluke, EPI classe 1000V e resposta rápida em toda São José dos Campos e Vale do Paraíba."
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  {/* Live Telemetry Footer Bar */}
                  <div className="border-t border-white/10 bg-[#0A0D12]/95 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                          <Radio className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white sm:text-sm">
                            Central de Despacho • SJC &amp; Vale
                          </p>
                          <p className="font-mono text-[11px] text-emerald-400">
                            ● Equipe disponível para saída imediata
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] font-bold text-amber-300">
                        NBR 5410
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive 24h Emergency Simulator */}
        <EmergencySimulator preselectedTrigger={simulatorTrigger} />

        {/* Complete Portal Service Catalog */}
        <section
          id="servicos"
          aria-labelledby="servicos-heading"
          className="scroll-mt-24 py-20 lg:py-28"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#121721] px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
                  <Wrench className="h-3.5 w-3.5" />
                  Portfólio Técnico Completo
                </div>
                <h2
                  id="servicos-heading"
                  className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                >
                  Catálogo de Serviços Elétricos de Alta Performance
                </h2>
                <p className="mt-3 text-base text-slate-400">
                  Filtre por segmento ou utilize a busca instantânea no topo
                  para encontrar soluções residenciais, corporativas,
                  industriais e de emergência 24h.
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div
                role="tablist"
                aria-label="Filtrar serviços por categoria"
                className="flex flex-wrap gap-2"
              >
                {categories.map((category) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-xl px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
                        active
                          ? "bg-amber-500 text-[#0A0D12] shadow-lg shadow-amber-500/20"
                          : "border border-white/10 bg-[#121721] text-slate-300 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Search Filter Pill */}
            {normalizedQuery && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm">
                <p className="text-amber-100">
                  Exibindo <strong>{filteredCatalog.length}</strong> serviço(s)
                  para a busca{" "}
                  <span className="font-mono text-amber-300">
                    &ldquo;{searchQuery}&rdquo;
                  </span>{" "}
                  em <strong>{selectedCategory}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Todos");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A0D12] px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                  Limpar filtros
                </button>
              </div>
            )}

            {/* Catalog Cards Grid */}
            {filteredCatalog.length > 0 ? (
              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCatalog.map((service) => (
                  <article
                    key={service.id}
                    className={`group flex flex-col justify-between rounded-2xl border bg-[#121721] p-6 transition-all hover:-translate-y-1 hover:border-amber-500/40 ${
                      service.featured
                        ? "border-amber-500/25 shadow-card-dark"
                        : "border-white/[0.08]"
                    }`}
                  >
                    <div>
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider ${
                            service.category === "Emergência 24h"
                              ? "bg-amber-500/15 text-amber-300"
                              : service.category === "Comercial/Industrial"
                                ? "bg-sky-500/15 text-sky-300"
                                : "bg-emerald-500/15 text-emerald-300"
                          }`}
                        >
                          {service.category === "Emergência 24h" && (
                            <Zap className="h-3 w-3" />
                          )}
                          {service.category === "Residencial" && (
                            <Home className="h-3 w-3" />
                          )}
                          {service.category === "Comercial/Industrial" && (
                            <Building2 className="h-3 w-3" />
                          )}
                          {service.category}
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-[#0A0D12] px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                          <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                          {service.warranty}
                        </span>
                      </div>

                      <h3 className="text-lg font-extrabold leading-snug text-white group-hover:text-amber-300">
                        {service.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                        {service.summary}
                      </p>

                      <ul className="mt-5 space-y-2 border-t border-white/[0.07] pt-4">
                        {service.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="flex items-start gap-2 text-xs text-slate-300"
                          >
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                        <span>Média: {service.avgTime}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleOpenInSimulator(service.simulatorLink)
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3.5 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-500 hover:text-[#0A0D12]"
                      >
                        Simular Agora
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-white/10 bg-[#121721] p-10 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-amber-400" />
                <h3 className="mt-3 text-lg font-bold text-white">
                  Não encontrou exatamente o serviço buscado?
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                  Nossa equipe de engenharia realiza projetos sob medida e
                  diagnósticos personalizados em todo o Vale do Paraíba.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("Todos");
                    }}
                    className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
                  >
                    Ver Todo o Catálogo
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection("simulador")}
                    className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-extrabold text-[#0A0D12] hover:bg-amber-400"
                  >
                    Abrir Simulador 24h
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Engineering Authority & Visual Showcase (4:3 EPI + Industrial Panel) */}
        <section
          id="engenharia"
          aria-labelledby="engenharia-heading"
          className="scroll-mt-24 border-y border-white/[0.08] bg-[#0D1119] py-20 lg:py-28"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
                <Award className="h-3.5 w-3.5" />
                Padrão Diretor de Segurança &amp; Engenharia
              </div>
              <h2
                id="engenharia-heading"
                className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              >
                Por que Empresas, Condomínios e Residências de Alto Padrão
                Escolhem a VoltPrime
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Showcase 1: EPI & NR-10 */}
              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121721]">
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#0A0D12]">
                  <ExecutiveImage
                    src="/images/eletricista-epi.jpg"
                    alt="Eletricista certificado NR-10 utilizando EPI dielétrico completo em atendimento VoltPrime"
                    fallbackBadge="Segurança NR-10 & EPI 1000V"
                    fallbackTitle="Protocolo Rígido de Segurança Elétrica"
                    fallbackSubtitle="Profissionais uniformizados, identificados e equipados com ferramentas isoladas VDE 1000V e EPIs certificados."
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="p-6 sm:p-7">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <Lock className="h-4 w-4" />
                    Segurança Patrimonial e Normativa
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    Profissionais Certificados NR-10, NR-35 e CREA-SP
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                    Cada técnico atua com instrumental calibrado, bloqueio e
                    etiquetagem (LOTO), luvas isolantes e identificação completa
                    para acesso ágil em condomínios fechados e plantas
                    corporativas.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-white/[0.07] bg-[#0A0D12] p-3">
                      <span className="font-mono font-bold text-amber-400">
                        VDE 1000V
                      </span>
                      <p className="mt-1 text-slate-400">
                        Ferramental isolado homologado
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.07] bg-[#0A0D12] p-3">
                      <span className="font-mono font-bold text-amber-400">
                        ART &amp; NFS-e
                      </span>
                      <p className="mt-1 text-slate-400">
                        Rastreabilidade jurídica total
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Showcase 2: Industrial Panel & Thermography */}
              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121721]">
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#0A0D12]">
                  <ExecutiveImage
                    src="/images/painel-industrial.jpg"
                    alt="Painel elétrico industrial QGBT organizado com barramento e análise termográfica VoltPrime"
                    fallbackBadge="Painéis QDC & QGBT Industrial"
                    fallbackTitle="Engenharia de Precisão em Baixa Tensão"
                    fallbackSubtitle="Montagem de quadros com barramento cobreado, balanceamento de fases, análise de harmônicas e termografia infravermelha."
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="p-6 sm:p-7">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <Cpu className="h-4 w-4" />
                    Diagnóstico Instrumentado &amp; Termografia
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    Zero Achismo: Medição Real de Carga, Isolação e Temperatura
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                    Detectamos conexões frouxas, desequilíbrio entre fases e
                    sobreaquecimento oculto em quadros QDC e painéis industriais
                    antes que evoluam para paradas críticas ou incêndios.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-white/[0.07] bg-[#0A0D12] p-3">
                      <span className="font-mono font-bold text-amber-400">
                        Termografia
                      </span>
                      <p className="mt-1 text-slate-400">
                        Detecção térmica sem desligar
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.07] bg-[#0A0D12] p-3">
                      <span className="font-mono font-bold text-amber-400">
                        True-RMS
                      </span>
                      <p className="mt-1 text-slate-400">
                        Precisão em cargas eletrônicas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Regional Coverage & Interactive FAQ Accordion */}
        <section
          id="cobertura"
          aria-labelledby="cobertura-heading"
          className="scroll-mt-24 py-20 lg:py-28"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              {/* Regional Coverage Column */}
              <div className="lg:col-span-5">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#121721] px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
                  <MapPin className="h-3.5 w-3.5" />
                  Malha de Atendimento Regional
                </div>
                <h2
                  id="cobertura-heading"
                  className="text-3xl font-extrabold tracking-tight text-white"
                >
                  Cobertura em São José dos Campos &amp; Vale do Paraíba
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Logística descentralizada para garantir chegada rápida tanto
                  nos bairros nobres e condomínios de SJC quanto no corredor
                  industrial da Via Dutra.
                </p>

                <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {COVERAGE_AREAS.map((area) => (
                    <div
                      key={area.name}
                      className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#121721] px-4 py-3.5 transition hover:border-amber-500/35"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            {area.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {area.region} • {area.type}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-md border border-white/10 bg-[#0A0D12] px-2.5 py-1 font-mono text-xs font-semibold text-amber-300">
                        {area.eta}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive FAQ Accordion Column */}
              <div id="faq" className="scroll-mt-24 lg:col-span-7">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#121721] px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
                  <FileCheck2 className="h-3.5 w-3.5" />
                  Central de Dúvidas Técnicas
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white">
                  Perguntas Frequentes (FAQ)
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Respostas diretas sobre SLA emergencial, garantia, emissão de
                  ART/CREA e faturamento corporativo.
                </p>

                <div className="mt-7 space-y-3">
                  {FAQ_ITEMS.map((item) => {
                    const isOpen = openFaqId === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`overflow-hidden rounded-2xl border transition-all ${
                          isOpen
                            ? "border-amber-500/40 bg-[#121721]"
                            : "border-white/[0.08] bg-[#121721]/70 hover:border-white/20"
                        }`}
                      >
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={`${item.id}-panel`}
                          onClick={() => setOpenFaqId(isOpen ? "" : item.id)}
                          className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                        >
                          <div className="space-y-1">
                            <span className="inline-block font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400">
                              {item.tag}
                            </span>
                            <p className="text-sm font-bold text-white sm:text-base">
                              {item.question}
                            </p>
                          </div>
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-transform ${
                              isOpen
                                ? "rotate-180 border-amber-500/40 bg-amber-500/15 text-amber-400"
                                : "border-white/10 bg-[#0A0D12] text-slate-400"
                            }`}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </span>
                        </button>

                        {isOpen && (
                          <div
                            id={`${item.id}-panel`}
                            className="border-t border-white/[0.06] px-5 pb-5 pt-4 text-sm leading-relaxed text-slate-300"
                          >
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Executive Quick Banner inside FAQ */}
                <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-[#121721] to-[#121721] p-6 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                      <Gauge className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        Precisa de orçamento corporativo ou contrato SLA?
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Atendimento dedicado para síndicos, facilities e
                        indústrias no Vale do Paraíba.
                      </p>
                    </div>
                  </div>
                  <a
                    href={WHATSAPP_DIRECT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-xs font-extrabold text-[#0A0D12] transition hover:bg-amber-400"
                  >
                    Falar com Engenharia
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Executive Corporate Footer */}
      <footer className="border-t border-white/[0.08] bg-[#07090D]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#0A0D12]">
                  <Zap className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <span className="block text-base font-extrabold tracking-tight text-white">
                    VOLT<span className="text-amber-400">PRIME</span> ELÉTRICA
                    24H
                  </span>
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    São José dos Campos • Vale do Paraíba
                  </span>
                </div>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                Portal corporativo de engenharia elétrica, retrofit de quadros e
                pronto atendimento emergencial 24 horas. Segurança normativa
                NBR 5410, NR-10 e responsabilidade técnica CREA-SP.
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs text-amber-400">
                <Activity className="h-4 w-4" />
                <span>Plantão Operacional 24h • 365 dias/ano</span>
              </div>
            </div>

            {/* Services Quick Links */}
            <div className="lg:col-span-3">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Especialidades
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenInSimulator("curto-disjuntor")}
                    className="transition hover:text-amber-400"
                  >
                    Emergência 24h &amp; Curto-circuito
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenInSimulator("quadro-qdc")}
                    className="transition hover:text-amber-400"
                  >
                    Montagem de Quadro QDC (DR/DPS)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenInSimulator("padrao-edp")}
                    className="transition hover:text-amber-400"
                  >
                    Padrão de Entrada EDP-SP
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenInSimulator("laudo-nr10")}
                    className="transition hover:text-amber-400"
                  >
                    Laudo Técnico NR-10 &amp; ART
                  </button>
                </li>
              </ul>
            </div>

            {/* Regional Base */}
            <div className="lg:col-span-3">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Base Operacional
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <span>
                    Av. Cassiano Ricardo, 601 — Jardim Aquarius, São José dos
                    Campos / SP
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 shrink-0 text-amber-400" />
                  <a
                    href="tel:+5512991002400"
                    className="font-mono text-slate-200 hover:text-amber-400"
                  >
                    (12) 99100-2400
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>CREA-SP • NR-10 • NR-35</span>
                </li>
              </ul>
            </div>

            {/* Direct Emergency Card */}
            <div className="lg:col-span-2">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Ação Rápida
              </h3>
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => scrollToSection("simulador")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-xs font-extrabold text-[#0A0D12] transition hover:bg-amber-400"
                >
                  Simular Chamado
                </button>
                <a
                  href={WHATSAPP_DIRECT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#121721] px-4 py-3 text-xs font-bold text-white transition hover:border-amber-500/50"
                >
                  WhatsApp 24h
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Luduran Oficiall Engineering Signature */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] pt-8 text-xs text-slate-500 sm:flex-row">
            <p>
              ©{" "}
              <span suppressHydrationWarning>
                {new Date().getFullYear()}
              </span>{" "}
              VoltPrime Elétrica 24h. Todos os direitos reservados.
            </p>
            <p className="text-center font-medium text-slate-400 sm:text-right">
              Desenvolvido por{" "}
              <a
                href="https://luduranoficiall.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-amber-400 transition hover:text-amber-300 hover:underline"
              >
                Luduran Oficiall | luduranoficiall.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
