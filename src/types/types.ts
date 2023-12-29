export interface ShortTripData {
  [provider: string]: {
    [tier: string]: {
      pricePerMinute: number;
      pricePerKm: number;
      unlockFee?: number;
      airportFee?: number;
    };
  };
}

export interface LongTripData {
  [provider: string]: {
    [tier: string]: {
      [time: string]: {
        includedKms: number | null;
        price: number | null;
        pricePerKm: number;
        extraKms?: number;
      };
    };
  };
}

export interface PriceData {
  provider: string;
  tier: string;
  price: string;
}

export interface MinPrices {
  provider: string;
  tier: string;
}

export interface Prices {
  [provider: string]: { [tier: string]: number | 'N/A' };
}
