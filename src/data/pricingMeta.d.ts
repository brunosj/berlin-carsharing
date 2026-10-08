export interface PricingSource {
  label: string;
  url: string;
  checks?: string[];
  optional?: boolean;
}

export interface PricingProviderMeta {
  displayName: string;
  formerly?: string;
  sources: PricingSource[];
}

export interface PricingMeta {
  lastUpdated: string;
  notes: string;
  assumptions?: Record<string, string>;
  providers: Record<string, PricingProviderMeta>;
}

declare const value: PricingMeta;
export default value;
