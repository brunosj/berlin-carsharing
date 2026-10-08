const labels: Record<string, Record<string, string>> = {
  Bolt: {
    Drive: 'Standard (from rates in app)',
  },
  MILES: {
    S: 'Small car',
    M: 'Medium / combi',
    Premium: 'Premium (from 1.09 €/km)',
    L: 'Transporter L',
    XL: 'Transporter XL',
  },
  Free2move: {
    S: 'City (e.g. Fiat 500e)',
    M: 'Compact (208, Corsa, C3)',
    L: 'SUV / larger',
  },
  SIXT: {
    Share: 'Minute rate (from 0.15 €/min)',
    ShareKm: 'Kilometre rate (from 0.99 €/km)',
    '1': 'Price class 1',
    '2': 'Price class 2',
    '3': 'Price class 3',
    '4': 'Price class 4',
    '5': 'Price class 5',
  },
};

export function tierLabel(provider: string, tier: string): string {
  return labels[provider]?.[tier] ?? tier;
}
