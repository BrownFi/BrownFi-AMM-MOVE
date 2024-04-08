export interface Tokens {
	[key: string]: any;
	[index: number]: any;
}

export interface CoinStats {
	totalLiquidityInUSD: number | string;
	priceChange24H: number | string;
	price: number | string;
	volume7D: number | string;
	volume24H: number | string;
	transaction24H: number | string;
	totalLiquidity: number | string;
	fee24H: number | string;
}

export interface CoinMetadata {
	decimals?: number;
	description?: string;
	iconUrl?: string;
	type?: string;
	isVerified?: boolean;
	symbol?: string;
	balance?: number | string;
	derivedSUI?: number | string;
	derivedPriceInUSD?: number | string;
	name?: string;
	id?: string;
	stats?: CoinStats;
	twitterUrl?: string;
	websiteUrl?: string;
	coinMarketcapUrl?: string;
	coingeckoUrl?: string;
}

export interface ICoinBalance {
	balance: number;
	type: string;
}

export type Reserve = {
	fields: {
		balance: string;
	};
	type: string;
};
