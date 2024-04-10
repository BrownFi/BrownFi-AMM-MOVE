export interface Token {
	coinObjectCount: number;
	coinType: string;
	lockedBalance: any;
	totalBalance: string;
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

export type TokenType = {
	type: string;
	account_address: string;
	module_name: string;
	struct_name: string;
};

export type ExtensionType = {
	data: [string, string][];
};

export type RawCoinInfo = {
	name: string;
	symbol: string;
	official_symbol: string;
	coingecko_id: string;
	decimals: number;
	logo_url: string;
	project_url: string;
	token_type: TokenType;
	extensions: ExtensionType;
};
