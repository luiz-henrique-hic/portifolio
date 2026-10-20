// Tipo compartilhado pelos três idiomas: se faltar uma chave em pt/en/es, o build falha.

export type Locale = 'pt' | 'en' | 'es';
export type Mode = 'gestor' | 'hic';

export type IconName =
  | 'briefcase' | 'cpu' | 'database' | 'server' | 'network' | 'shield' | 'users' | 'workflow'
  | 'bot' | 'sparkles' | 'terminal' | 'chart' | 'pie' | 'trending' | 'wallet' | 'receipt'
  | 'package' | 'truck' | 'cart' | 'scale' | 'file' | 'filecode' | 'layers' | 'settings'
  | 'zap' | 'target' | 'gauge' | 'kanban' | 'calendar' | 'alert' | 'search' | 'mail'
  | 'message' | 'code' | 'cloud' | 'box' | 'landmark' | 'graduation' | 'rocket' | 'lightbulb'
  | 'clipboard' | 'repeat' | 'monitor' | 'phone' | 'camera' | 'lock' | 'git' | 'brain' | 'trophy';

export type SectionId =
  | 'hero' | 'about' | 'timeline' | 'management' | 'sankhya' | 'salesforce'
  | 'ai' | 'dashboards' | 'thesis' | 'infra' | 'stack' | 'github' | 'contact';

/** value null = TODO (exibido como "—"; preencha no arquivo de conteúdo). */
export interface Metric {
  value: number | null;
  label: string;
  prefix?: string;
  suffix?: string;
}

export interface Card {
  icon: IconName;
  title: string;
  desc: string;
  tags?: string[];
}

export interface Case {
  icon: IconName;
  title: string;
  problem: string;
  solution: string;
  impact: string;
  tags?: string[];
}

export interface Step {
  title: string;
  desc: string;
}

export interface TimelineItem {
  period: string;
  org: string;
  role: string;
  kind: 'work' | 'venture' | 'edu';
  desc: string;
  steps?: string[];
}

export interface TerminalLine {
  text: string;
  kind: 'info' | 'ok' | 'file' | 'warn' | 'muted';
}

export interface SuggestStrings {
  message: string;
  accept: string;
  dismiss: string;
}

export interface Content {
  meta: { title: string; description: string; ogLocale: string; htmlLang: string; intl: string };
  nav: {
    sections: Record<SectionId, string>;
    language: string;
    themeDark: string;
    themeLight: string;
    menu: string;
    close: string;
    skip: string;
    progress: string;
  };
  mode: { label: string; gestor: string; hic: string; highlighted: Record<Mode, string> };
  suggest: SuggestStrings;
  hero: {
    location: string;
    greeting: string;
    roles: string[];
    positioning: Record<Mode, string>;
    cta: { github: string; linkedin: string; cv: string; cvSoon: string; contact: string };
    metrics: Record<Mode, Metric[]>;
  };
  about: {
    title: string;
    subtitle: string;
    gestor: { label: string; title: string; points: string[] };
    hic: { label: string; title: string; points: string[] };
  };
  timeline: {
    title: string;
    subtitle: string;
    hint: string;
    kinds: Record<TimelineItem['kind'], string>;
    items: TimelineItem[];
  };
  management: {
    title: string;
    subtitle: string;
    tabs: { it: string; ops: string };
    labels: { scope: string; responsibilities: string; deliveries: string; impact: string };
    it: {
      role: string;
      period: string;
      scope: string;
      responsibilities: string[];
      deliveries: Card[];
      impact: string;
    };
    ops: {
      role: string;
      period: string;
      scope: string;
      areasTitle: string;
      areasHint: string;
      areas: { name: string; icon: IconName; items: string[] }[];
      responsibilities: string[];
      deliveries: Card[];
      impact: string;
    };
    styleTitle: string;
    style: Card[];
    metricsTitle: string;
    metricsNote: string;
    metrics: Metric[];
  };
  sankhya: {
    title: string;
    subtitle: string;
    tabs: { reports: string; implementation: string; automations: string; params: string; custom: string };
    reports: Card[];
    sqlCaption: string;
    implementation: { intro: string; steps: Step[] };
    automations: Case[];
    javaCaption: string;
    params: Card[];
    custom: Card[];
  };
  salesforce: {
    title: string;
    subtitle: string;
    tabs: { automation: string; modules: string; custom: string };
    automation: Case[];
    apexCaption: string;
    modules: Card[];
    custom: Card[];
  };
  ai: {
    title: string;
    subtitle: string;
    skillsTitle: string;
    skills: Case[];
    agentsTitle: string;
    agents: Card[];
    programTitle: string;
    programDesc: string;
    programStats: Metric[];
    deliverablesTitle: string;
    deliverables: string[];
    toolsTitle: string;
    tools: Card[];
    terminal: { title: string; command: string; lines: TerminalLine[]; replay: string };
  };
  dashboards: {
    title: string;
    subtitle: string;
    disclaimer: string;
    client: string;
    tabs: { kanban: string; stock: string; abc: string; budget: string; goal: string };
    kanban: { phases: string[]; urgent: string; attention: string; ok: string; days: string; total: string };
    stock: { title: string; columns: string[]; statuses: string[]; items: string[] };
    abc: { title: string; classA: string; classB: string; classC: string; cumulative: string; revenue: string };
    budget: { title: string; months: string[]; budget: string; actual: string; monthly: string; ytd: string; variance: string };
    goal: { title: string; goal: string; achieved: string; remaining: string; daysLeft: string; simulate: string };
  };
  thesis: {
    title: string;
    subtitle: string;
    badge: string;
    blocks: Step[];
    pipelineTitle: string;
    pipeline: Step[];
    continuation: string;
    mqlCaption: string;
    chart: { title: string; price: string; fast: string; slow: string; entry: string; exit: string; disclaimer: string; replay: string };
  };
  infra: { title: string; subtitle: string; items: Card[] };
  stack: {
    title: string;
    subtitle: string;
    groups: { title: string; icon: IconName; items: string[] }[];
    languagesTitle: string;
    languages: { name: string; level: string }[];
  };
  github: {
    title: string;
    subtitle: string;
    featured: string;
    recent: string;
    updated: string;
    viewProfile: string;
    loading: string;
    error: string;
    rateLimit: string;
    empty: string;
    notConfigured: string;
    noDescription: string;
  };
  contact: { title: string; subtitle: string; email: string; linkedin: string; github: string; note: string };
  footer: { built: string; rights: string; top: string };
  common: { problem: string; solution: string; impact: string; expand: string; collapse: string; fictitious: string; copy: string; copied: string };
}
