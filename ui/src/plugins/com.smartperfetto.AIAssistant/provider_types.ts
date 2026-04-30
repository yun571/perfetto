// SPDX-License-Identifier: AGPL-3.0-or-later

export type ProviderType =
  | 'anthropic'
  | 'bedrock'
  | 'vertex'
  | 'deepseek'
  | 'openai'
  | 'ollama'
  | 'custom';
export type ProviderCategory = 'official' | 'proxy' | 'local' | 'custom';

export type HealthStatus = 'passed' | 'failed' | 'untested';

export interface ProviderModels {
  primary: string;
  light: string;
  subAgent?: string;
}

export interface ProviderConnection {
  apiKey?: string;
  baseUrl?: string;
  awsRegion?: string;
  awsBearerToken?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  awsSessionToken?: string;
  awsProfile?: string;
  gcpProjectId?: string;
  gcpRegion?: string;
  useBedrock?: boolean;
}

export interface ProviderTuning {
  maxTurns?: number;
  effort?: string;
  maxBudgetUsd?: number;
  fullPerTurnMs?: number;
  quickPerTurnMs?: number;
  verifierTimeoutMs?: number;
  classifierTimeoutMs?: number;
  enableSubAgents?: boolean;
  enableVerification?: boolean;
}

export interface ProviderConfig {
  id: string;
  name: string;
  category: ProviderCategory;
  type: ProviderType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  models: ProviderModels;
  connection: ProviderConnection;
  tuning?: ProviderTuning;
  custom?: {envOverrides?: Record<string, string>};
}

export interface ProviderTemplate {
  type: ProviderType;
  displayName: string;
  requiredFields: string[];
  defaultModels: ProviderModels;
  availableModels: Array<{id: string; name: string; tier: string}>;
}

export interface ProviderPanelAttrs {
  backendUrl: string;
  apiKey?: string;
  onClose?: () => void;
}

export interface ProviderQuickSwitcherAttrs {
  backendUrl: string;
  apiKey?: string;
  compact?: boolean;
  onActivate?: () => void;
}

export const TYPE_ICONS: Record<ProviderType, string> = {
  anthropic: '\u{1F916}',
  bedrock: '☁️',
  vertex: '\u{1F537}',
  deepseek: '\u{1F40B}',
  openai: '⚡',
  ollama: '\u{1F999}',
  custom: '\u{1F527}',
};

export const CATEGORY_LABELS: Record<ProviderCategory, string> = {
  official: 'Official',
  proxy: 'Proxy',
  local: 'Local',
  custom: 'Custom',
};

export const CONNECTION_FIELD_LABELS: Record<string, {label: string; type: string; placeholder: string}> = {
  apiKey: {label: 'API Key', type: 'password', placeholder: 'sk-...'},
  baseUrl: {label: 'Base URL', type: 'text', placeholder: 'https://api.example.com'},
  awsRegion: {label: 'AWS Region', type: 'text', placeholder: 'us-east-1'},
  awsBearerToken: {label: 'AWS Bearer Token', type: 'password', placeholder: 'Token...'},
  awsAccessKeyId: {label: 'AWS Access Key ID', type: 'text', placeholder: 'AKIA...'},
  awsSecretAccessKey: {label: 'AWS Secret Access Key', type: 'password', placeholder: 'Secret...'},
  awsSessionToken: {label: 'AWS Session Token', type: 'password', placeholder: 'Session token...'},
  awsProfile: {label: 'AWS Profile', type: 'text', placeholder: 'default'},
  gcpProjectId: {label: 'GCP Project ID', type: 'text', placeholder: 'my-project-123'},
  gcpRegion: {label: 'GCP Region', type: 'text', placeholder: 'us-central1'},
};

export function buildHeaders(apiKey?: string): Record<string, string> {
  const headers: Record<string, string> = {'Content-Type': 'application/json'};
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
  return headers;
}

export function apiUrl(backendUrl: string, path: string): string {
  const base = backendUrl.replace(/\/+$/, '');
  return `${base}/api/v1/providers${path}`;
}

export type BedrockAuthMethod = 'bearer' | 'accessKey' | 'profile';

export interface FormState {
  name: string;
  type: ProviderType;
  models: ProviderModels;
  connection: ProviderConnection;
  tuning: ProviderTuning;
  showTuning: boolean;
  useBedrock: boolean;
  bedrockAuthMethod: BedrockAuthMethod;
}

export function createEmptyForm(): FormState {
  return {
    name: '',
    type: 'anthropic',
    models: {primary: '', light: ''},
    connection: {},
    tuning: {},
    showTuning: false,
    useBedrock: true,
    bedrockAuthMethod: 'accessKey',
  };
}
