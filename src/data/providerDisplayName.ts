import meta from './pricingMeta.json';
import type { PricingMeta } from './pricingMeta.d.ts';

export const pricingMeta: PricingMeta = meta;

const displayNames = Object.fromEntries(
  Object.entries(pricingMeta.providers).map(([key, value]) => [
    key,
    value.displayName,
  ])
);

export function providerDisplayName(providerKey: string): string {
  return displayNames[providerKey] ?? providerKey;
}
