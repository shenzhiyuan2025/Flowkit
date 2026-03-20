export type TrustLevel = "L1" | "L2";

export interface WidgetActionMap {
  [name: string]: {
    event: string;
    params?: string[];
    label?: string;
  };
}

export interface FlowKitWidget {
  id?: string;
  type: string;
  data: Record<string, unknown>;
  options?: Record<string, unknown>;
  actions?: WidgetActionMap;
  fallback?: string;
  trust?: TrustLevel;
  remove?: boolean;
}

export interface FlowKitMessage {
  role: "system" | "user" | "assistant" | string;
  content: string;
  widgets?: FlowKitWidget[];
}

export interface ValidationResult<T = unknown> {
  valid: boolean;
  errors: string[];
  value?: T;
}
