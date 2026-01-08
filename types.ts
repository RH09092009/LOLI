
export enum OperationMode {
  OMNI_ARCHITECT = 'Omni-Architecture',
  QUANTUM_INTEL = 'Quantum Intelligence',
  REALITY_MAPPING = 'Reality Mapping',
}

export interface Message {
  role: 'user' | 'system' | 'assistant';
  content: string;
  timestamp: Date;
  mode?: OperationMode;
  groundingLinks?: GroundingLink[];
  confidenceScore?: number;
  isMock?: boolean;
}

export interface GroundingLink {
  uri: string;
  title: string;
  source?: 'search' | 'maps';
}

export interface SystemState {
  isOperational: boolean;
  isMockEnabled: boolean;
  activeMode: OperationMode;
  latency: number;
  uptime: string;
  governorStatus: string;
}
