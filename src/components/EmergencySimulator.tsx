"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FileCheck2,
  MapPin,
  MessageSquare,
  ShieldCheck,
  SlidersHorizontal,
  Zap,
} from "lucide-react";

export type ProblemId =
  | "curto-disjuntor"
  | "quadro-qdc"
  | "padrao-edp"
  | "instalacao-220v"
  | "tomadas-iluminacao"
  | "laudo-nr10";

export interface SimulatorTrigger {
  problemId: ProblemId;
  seq: number;
}

interface ProblemOption {
  id: ProblemId;
  label: string;
  shortTag: string;
  description: string;
  baseMin: number;
  baseMax: number;
  estimatedWorkTime: string;
  equipment: string;
  normRef: string;
}

interface LocationOption {
  id: string;
  label: string;
  zone: string;
  etaMin: number;
  etaMax: number;
  dispatchFee: number;
}

interface UrgencyOption {
  id: "imediata" | "hoje" | "programado";
  label: string;
  subtitle: string;
  priceMultiplier: number;
  etaModifierText: string;
  priorityBadge: string;
}

export const SIMULATOR_PROBLEMS: ProblemOption[] = [
  {
    id: "curto-disjuntor",
    label: "Queda de disjuntor / Curto-circuito",
    shortTag: "Prioridade Crítica",
    description:
      "Desarme recorrente, cheiro de queimado, falta parcial de fase ou aquecimento de cabos.",
    baseMin: 240,
    baseMax: 480,
    estimatedWorkTime: "45 min a 2h",
    equipment: "Câmera termográfica Fluke + Alicate amperímetro True-RMS",
    normRef: "NBR 5410 / NR-10",
  },
  {
    id: "quadro-qdc",
    label: "Quadro QDC completo",
    shortTag: "Retrofit & Proteção",
    description:
      "Substituição ou montagem de quadro de distribuição com barramento pente, DR e DPS.",
    baseMin: 890,
    baseMax: 2450,
    estimatedWorkTime: "4h a 8h",
    equipment: "Kit barramento cobreado + Certificador de aterramento",
    normRef: "NBR 5410 (DR + DPS)",
  },
  {
    id: "padrao-edp",
    label: "Padrão de entrada EDP",
    shortTag: "Homologado EDP",
    description:
      "Adequação de caixa de medição, ramal de entrada, aumento de carga bifásico/trifásico.",
    baseMin: 1150,
    baseMax: 3200,
    estimatedWorkTime: "1 a 2 dias úteis",
    equipment: "Projeto unifilar + ART CREA + Kit padrão EDP-SP",
    normRef: "Norma Técnica EDP-SP",
  },
  {
    id: "instalacao-220v",
    label: "Instalação 220V / Ar-condicionado",
    shortTag: "Circuito Dedicado",
    description:
      "Passagem de circuito exclusivo em cabo flexível dimensionado com disjuntor dedicado.",
    baseMin: 280,
    baseMax: 620,
    estimatedWorkTime: "1h30 a 3h",
    equipment: "Sonda passa-fio industrial + Torquímetro isolado 1000V",
    normRef: "NBR 5410 Seção 6.2",
  },
  {
    id: "tomadas-iluminacao",
    label: "Tomadas / Iluminação",
    shortTag: "Residencial & Corp",
    description:
      "Pontos 20A, automação de iluminação LED, perfis arquitetônicos e correção de fugas.",
    baseMin: 190,
    baseMax: 440,
    estimatedWorkTime: "1h a 2h30",
    equipment: "Testador de polaridade/aterramento + Laser de alinhamento",
    normRef: "NBR 14136 / NBR 5410",
  },
  {
    id: "laudo-nr10",
    label: "Laudo NR-10",
    shortTag: "Engenharia & ART",
    description:
      "Inspeção técnica completa, relatório fotográfico, termografia e emissão de ART CREA.",
    baseMin: 1200,
    baseMax: 3800,
    estimatedWorkTime: "Vistoria 3h + Laudo em 48h",
    equipment: "Analisador de qualidade de energia + Termovisor calibrado",
    normRef: "NR-10 / NBR 5419 / CREA-SP",
  },
];

const LOCATIONS: LocationOption[] = [
  {
    id: "jardim-aquarius",
    label: "Jardim Aquarius",
    zone: "Zona Oeste • Base Operacional SJC",
    etaMin: 18,
    etaMax: 28,
    dispatchFee: 0,
  },
  {
    id: "urbanova",
    label: "Urbanova",
    zone: "Zona Oeste • Condomínios SJC",
    etaMin: 22,
    etaMax: 35,
    dispatchFee: 0,
  },
  {
    id: "vila-ema",
    label: "Vila Ema",
    zone: "Região Central • SJC",
    etaMin: 15,
    etaMax: 25,
    dispatchFee: 0,
  },
  {
    id: "jardim-satelite",
    label: "Jardim Satélite",
    zone: "Zona Sul • SJC",
    etaMin: 20,
    etaMax: 32,
    dispatchFee: 0,
  },
  {
    id: "centro-sjc",
    label: "Centro SJC",
    zone: "Eixo Corporativo • SJC",
    etaMin: 18,
    etaMax: 30,
    dispatchFee: 0,
  },
  {
    id: "jacarei",
    label: "Jacareí",
    zone: "Vale do Paraíba • Via Dutra",
    etaMin: 30,
    etaMax: 45,
    dispatchFee: 45,
  },
  {
    id: "taubate",
    label: "Taubaté",
    zone: "Vale do Paraíba • Eixo Industrial",
    etaMin: 40,
    etaMax: 55,
    dispatchFee: 70,
  },
];

const URGENCIES: UrgencyOption[] = [
  {
    id: "imediata",
    label: "Emergência Imediata 24h",
    subtitle: "Despacho instantâneo de unidade móvel de plantão",
    priceMultiplier: 1.25,
    etaModifierText: "Saída imediata da base",
    priorityBadge: "SLA PRIORITÁRIO 24H",
  },
  {
    id: "hoje",
    label: "Agendado Hoje",
    subtitle: "Janela técnica confirmada no mesmo dia (sem taxa emergencial)",
    priceMultiplier: 1.0,
    etaModifierText: "Janela confirmada em até 3 horas",
    priorityBadge: "MESMO DIA",
  },
  {
    id: "programado",
    label: "Orçamento Programado",
    subtitle: "Visita técnica e proposta detalhada com melhor custo-benefício",
    priceMultiplier: 0.9,
    etaModifierText: "Agendamento flexível (Seg a Sáb)",
    priorityBadge: "CUSTO OTIMIZADO",
  },
];

interface EmergencySimulatorProps {
  preselectedTrigger?: SimulatorTrigger | null;
}

const WHATSAPP_NUMBER = "5512991002400";

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(Math.round(value / 10) * 10);
}

export default function EmergencySimulator({
  preselectedTrigger,
}: EmergencySimulatorProps) {
  const [selectedProblemId, setSelectedProblemId] =
    useState<ProblemId>("curto-disjuntor");
  const [selectedLocationId, setSelectedLocationId] =
    useState<string>("jardim-aquarius");
  const [selectedUrgencyId, setSelectedUrgencyId] = useState<
    "imediata" | "hoje" | "programado"
  >("imediata");
  const [notes, setNotes] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (preselectedTrigger) {
      setSelectedProblemId(preselectedTrigger.problemId);
    }
  }, [preselectedTrigger]);

  const currentProblem = useMemo(() => {
    return (
      SIMULATOR_PROBLEMS.find((item) => item.id === selectedProblemId) ??
      SIMULATOR_PROBLEMS[0]
    );
  }, [selectedProblemId]);

  const currentLocation = useMemo(() => {
    return (
      LOCATIONS.find((item) => item.id === selectedLocationId) ?? LOCATIONS[0]
    );
  }, [selectedLocationId]);

  const currentUrgency = useMemo(() => {
    return (
      URGENCIES.find((item) => item.id === selectedUrgencyId) ?? URGENCIES[0]
    );
  }, [selectedUrgencyId]);

  const simulation = useMemo(() => {
    const minEstimate =
      currentProblem.baseMin * currentUrgency.priceMultiplier +
      currentLocation.dispatchFee;
    const maxEstimate =
      currentProblem.baseMax * currentUrgency.priceMultiplier +
      currentLocation.dispatchFee;

    const arrivalLabel =
      currentUrgency.id === "imediata"
        ? `${currentLocation.etaMin} a ${currentLocation.etaMax} min`
        : currentUrgency.id === "hoje"
          ? "Hoje (janela de 2h a 3h)"
          : "Data e horário à sua escolha";

    const protocolSeed =
      currentProblem.id.length * 137 +
      currentLocation.id.length * 53 +
      currentUrgency.id.length * 29;
    const protocolCode = `VP-24H-${String(protocolSeed).padStart(4, "0")}`;

    const summaryText = [
      `⚡ *CHAMADO TÉCNICO — VOLTPRIME ELÉTRICA 24H*`,
      `Protocolo de Triagem: *${protocolCode}*`,
      ``,
      `• *Ocorrência:* ${currentProblem.label}`,
      `• *Localização:* ${currentLocation.label} (${currentLocation.zone})`,
      `• *Nível de Urgência:* ${currentUrgency.label}`,
      `• *Previsão de Chegada:* ${arrivalLabel}`,
      `• *Faixa Estimada (Mão de Obra/Diagnóstico):* ${formatBRL(minEstimate)} a ${formatBRL(maxEstimate)}`,
      `• *Conformidade:* ${currentProblem.normRef}`,
      notes.trim() ? `• *Observação do Cliente:* ${notes.trim()}` : null,
      ``,
      `Solicito confirmação da equipe técnica CREA/NR-10 para atendimento.`,
    ]
      .filter(Boolean)
      .join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      summaryText
    )}`;

    return {
      minEstimate,
      maxEstimate,
      arrivalLabel,
      protocolCode,
      summaryText,
      whatsappUrl,
    };
  }, [currentProblem, currentLocation, currentUrgency, notes]);

  async function handleCopySummary() {
    try {
      await navigator.clipboard.writeText(simulation.summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = simulation.summaryText;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    }
  }

  return (
    <section
      id="simulador"
      aria-labelledby="simulador-heading"
      className="relative scroll-mt-24 border-y border-white/[0.08] bg-[#0D1119] py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-executive-grid bg-grid-md opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Triagem Digital Instantânea 24h
            </div>
            <h2
              id="simulador-heading"
              className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
            >
              Simulador de Chamado Urgente &amp; Tempo de Despacho
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-400">
              Configure os 3 parâmetros técnicos abaixo para visualizar a
              previsão de chegada da unidade móvel, faixa transparente de
              investimento e gerar o briefing técnico pronto para o plantão.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <div>
              <p className="font-semibold text-emerald-200">
                3 Unidades Móveis em Operação Agora
              </p>
              <p className="text-xs text-emerald-300/80">
                Bases ativas: Jardim Aquarius, Centro SJC e Via Dutra
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <div className="rounded-2xl border border-white/[0.08] bg-[#121721] p-6 shadow-card-dark">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 font-mono text-sm font-bold text-[#0A0D12]">
                    01
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Tipo de Problema ou Demanda Elétrica
                    </h3>
                    <p className="text-xs text-slate-400">
                      Selecione o cenário mais próximo da ocorrência atual
                    </p>
                  </div>
                </div>
                <Zap className="hidden h-5 w-5 text-amber-500 sm:block" />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SIMULATOR_PROBLEMS.map((problem) => {
                  const isSelected = problem.id === selectedProblemId;
                  return (
                    <button
                      key={problem.id}
                      type="button"
                      onClick={() => setSelectedProblemId(problem.id)}
                      aria-pressed={isSelected}
                      className={`group flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/10 shadow-[0_0_25px_-10px_rgba(245,158,11,0.55)]"
                          : "border-white/[0.07] bg-[#0D1119] hover:border-white/20 hover:bg-[#151C28]"
                      }`}
                    >
                      <div className="mb-2 flex w-full items-center justify-between gap-2">
                        <span
                          className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                            isSelected
                              ? "bg-amber-500 text-[#0A0D12]"
                              : "bg-white/5 text-slate-400"
                          }`}
                        >
                          {problem.shortTag}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400" />
                        )}
                      </div>
                      <span className="text-sm font-bold text-white">
                        {problem.label}
                      </span>
                      <span className="mt-1.5 text-xs leading-relaxed text-slate-400">
                        {problem.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#121721] p-6 shadow-card-dark">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 font-mono text-sm font-bold text-[#0A0D12]">
                    02
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Bairro ou Cidade no Vale do Paraíba
                    </h3>
                    <p className="text-xs text-slate-400">
                      Cálculo dinâmico de rota e tempo de deslocamento da equipe
                    </p>
                  </div>
                </div>
                <MapPin className="hidden h-5 w-5 text-amber-500 sm:block" />
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {LOCATIONS.map((location) => {
                  const isSelected = location.id === selectedLocationId;
                  return (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() => setSelectedLocationId(location.id)}
                      aria-pressed={isSelected}
                      className={`rounded-xl border px-3.5 py-3 text-left transition-all ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/15 text-white"
                          : "border-white/[0.07] bg-[#0D1119] text-slate-300 hover:border-white/20 hover:bg-[#151C28]"
                      }`}
                    >
                      <span className="block text-sm font-semibold">
                        {location.label}
                      </span>
                      <span
                        className={`mt-1 block font-mono text-[11px] ${
                          isSelected ? "text-amber-300" : "text-slate-500"
                        }`}
                      >
                        ~{location.etaMin}-{location.etaMax} min
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#121721] p-6 shadow-card-dark">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 font-mono text-sm font-bold text-[#0A0D12]">
                    03
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Nível de Urgência &amp; Observação Técnica
                    </h3>
                    <p className="text-xs text-slate-400">
                      Escolha entre plantão emergencial imediato ou agendamento
                    </p>
                  </div>
                </div>
                <Clock className="hidden h-5 w-5 text-amber-500 sm:block" />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {URGENCIES.map((urgency) => {
                  const isSelected = urgency.id === selectedUrgencyId;
                  return (
                    <button
                      key={urgency.id}
                      type="button"
                      onClick={() => setSelectedUrgencyId(urgency.id)}
                      aria-pressed={isSelected}
                      className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/15"
                          : "border-white/[0.07] bg-[#0D1119] hover:border-white/20 hover:bg-[#151C28]"
                      }`}
                    >
                      <div>
                        <span
                          className={`inline-block rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                            urgency.id === "imediata"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-white/10 text-slate-300"
                          }`}
                        >
                          {urgency.priorityBadge}
                        </span>
                        <p className="mt-2.5 text-sm font-bold text-white">
                          {urgency.label}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                          {urgency.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5">
                <label
                  htmlFor="simulator-notes"
                  className="mb-1.5 block text-xs font-medium text-slate-400"
                >
                  Detalhes adicionais (opcional — ex.: apartamento, disjuntor
                  geral 63A, condomínio)
                </label>
                <input
                  id="simulator-notes"
                  type="text"
                  value={notes}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNotes(e.target.value)
                  }
                  placeholder="Ex.: Disjuntor geral desarmando ao ligar ar-condicionado na suíte..."
                  className="w-full rounded-xl border border-white/10 bg-[#0A0D12] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-2xl border border-amber-500/30 bg-[#121721] p-6 shadow-volt-glow sm:p-7">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Diagnóstico Preliminar
                  </span>
                  <h3 className="mt-0.5 text-xl font-extrabold text-white">
                    Resumo do Despacho Técnico
                  </h3>
                </div>
                <span className="rounded-lg border border-white/10 bg-[#0A0D12] px-2.5 py-1 font-mono text-xs font-semibold text-slate-300">
                  {simulation.protocolCode}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.08] bg-[#0A0D12] p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Clock className="h-4 w-4 text-amber-400" />
                    Previsão de Chegada
                  </div>
                  <p className="mt-2 text-xl font-extrabold text-white">
                    {simulation.arrivalLabel}
                  </p>
                  <p className="mt-1 text-[11px] text-amber-400/90">
                    {currentUrgency.etaModifierText}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-[#0A0D12] p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Activity className="h-4 w-4 text-amber-400" />
                    Faixa Transparente
                  </div>
                  <p className="mt-2 text-xl font-extrabold text-amber-400">
                    {formatBRL(simulation.minEstimate)} –{" "}
                    {formatBRL(simulation.maxEstimate)}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Aprovação prévia no local antes de executar
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 rounded-xl border border-white/[0.07] bg-[#0D1119] p-4 text-xs">
                <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-2.5">
                  <span className="text-slate-400">Ocorrência</span>
                  <span className="text-right font-semibold text-white">
                    {currentProblem.label}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-2.5">
                  <span className="text-slate-400">Região / Base</span>
                  <span className="text-right font-semibold text-white">
                    {currentLocation.label}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-2.5">
                  <span className="text-slate-400">Tempo Médio em Campo</span>
                  <span className="text-right font-mono font-medium text-slate-200">
                    {currentProblem.estimatedWorkTime}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-2.5">
                  <span className="text-slate-400">Instrumentação</span>
                  <span className="text-right text-slate-200">
                    {currentProblem.equipment}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-400">Norma Aplicada</span>
                  <span className="inline-flex items-center gap-1 font-mono font-semibold text-amber-300">
                    <FileCheck2 className="h-3.5 w-3.5" />
                    {currentProblem.normRef}
                  </span>
                </div>
              </div>

              {currentUrgency.id === "imediata" && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3.5 text-xs text-amber-200">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <p className="leading-relaxed">
                    Em caso de cheiro forte de fumaça ou faíscas, desligue o
                    disjuntor geral se for seguro e acione o plantão imediato
                    abaixo.
                  </p>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <a
                  href={simulation.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-amber-500 px-5 py-4 text-sm font-extrabold text-[#0A0D12] shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#121721]"
                >
                  <MessageSquare className="h-4 w-4" />
                  Enviar Resumo Técnico no WhatsApp 24h
                </a>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#0A0D12] px-5 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-amber-500/50 hover:text-white"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-300">
                        Resumo Técnico Copiado para a Área de Transferência
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-amber-400" />
                      Copiar Resumo Técnico Pronto
                    </>
                  )}
                </button>
              </div>

              <div className="mt-5 flex items-center justify-center gap-4 border-t border-white/[0.08] pt-4 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                  Garantia Documentada
                </span>
                <span>•</span>
                <span>Nota Fiscal &amp; PIX/Cartão</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
