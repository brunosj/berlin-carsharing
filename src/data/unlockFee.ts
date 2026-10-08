import { shortTripData } from './shortTripData';

/** Per-trip unlock/base fee for long-trip estimates (aligned with short-trip data). */
export function getUnlockFee(provider: string, tier: string): number {
  const tiers = shortTripData[provider as keyof typeof shortTripData];
  if (!tiers) return 0;

  const tierFees = tiers as Record<string, { unlockFee?: number }>;
  if (tierFees[tier]?.unlockFee != null) {
    return tierFees[tier].unlockFee ?? 0;
  }

  if (provider === 'SIXT') {
    if ('Share' in tierFees) return tierFees.Share.unlockFee ?? 0;
  }

  return 0;
}
