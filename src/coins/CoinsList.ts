import { RawCoinInfo } from "../model/coins";

export const REQUESTS_DEVNET: RawCoinInfo[] = [
	{
		name: "Tether USD",
		symbol: "USDT",
		official_symbol: "USDT",
		coingecko_id: "tether",
		decimals: 8,
		logo_url: "https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDT.svg",
		project_url: "",
		token_type: {
			type: "0x9fb972059f12bcdded441399300076d7cff7d9946669d3a79b5fb837e2c49b09::coins:USDT            ",
			account_address: "0x9fb972059f12bcdded441399300076d7cff7d9946669d3a79b5fb837e2c49b09",
			module_name: "coins",
			struct_name: "USDT",
		},
		extensions: {
			data: [],
		},
	},
	{
		name: "XBTC",
		symbol: "XBTC",
		official_symbol: "XBTC",
		coingecko_id: "",
		decimals: 8,
		logo_url: "https://coming-website.s3.us-east-2.amazonaws.com/icon_xbtc_30.png",
		project_url: "https://github.com/OmniBTC/OmniBridge",
		token_type: {
			type: "0x9fb972059f12bcdded441399300076d7cff7d9946669d3a79b5fb837e2c49b09::coins:XBTC            ",
			account_address: "0x9fb972059f12bcdded441399300076d7cff7d9946669d3a79b5fb837e2c49b09",
			module_name: "coins",
			struct_name: "XBTC",
		},
		extensions: {
			data: [],
		},
	},
	{
		name: "Sui Coin",
		symbol: "SUI",
		official_symbol: "SUI",
		coingecko_id: "Sui",
		decimals: 9,
		logo_url: "https://raw.githubusercontent.com/MystenLabs/sui/main/apps/wallet/src/ui/assets/images/sui-icon.png",
		project_url: "http://sui.io/",
		token_type: {
			type: "0x2::sui::SUI",
			account_address: "0x2",
			module_name: "sui",
			struct_name: "SUI",
		},
		extensions: {
			data: [],
		},
	},
	{
		name: "BTC",
		symbol: "BTC",
		official_symbol: "BTC",
		coingecko_id: "",
		decimals: 8,
		logo_url: "https://coming-website.s3.us-east-2.amazonaws.com/icon_xbtc_30.png",
		project_url: "https://github.com/OmniBTC/OmniBridge",
		token_type: {
			type: "0x9fb972059f12bcdded441399300076d7cff7d9946669d3a79b5fb837e2c49b09::coins:BTC            ",
			account_address: "0x9fb972059f12bcdded441399300076d7cff7d9946669d3a79b5fb837e2c49b09",
			module_name: "coins",
			struct_name: "BTC",
		},
		extensions: {
			data: [],
		},
	},
	{
		name: "Binance Coin",
		symbol: "BNB",
		official_symbol: "BNB",
		coingecko_id: "binancecoin",
		decimals: 8,
		logo_url: "https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/BNB.svg",
		project_url: "",
		token_type: {
			type: "0x9fb972059f12bcdded441399300076d7cff7d9946669d3a79b5fb837e2c49b09::coins:BNB            ",
			account_address: "0x9fb972059f12bcdded441399300076d7cff7d9946669d3a79b5fb837e2c49b09",
			module_name: "coins",
			struct_name: "BNB",
		},
		extensions: {
			data: [],
		},
	},

	{
		name: "Ethereum",
		symbol: "ETH",
		official_symbol: "ETH",
		coingecko_id: "eth",
		decimals: 6,
		logo_url: "https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/WETH.svg",
		project_url: "",
		token_type: {
			type: "0x9fb972059f12bcdded441399300076d7cff7d9946669d3a79b5fb837e2c49b09::coins::ETH",
			account_address: "0x9fb972059f12bcdded441399300076d7cff7d9946669d3a79b5fb837e2c49b09",
			module_name: "coins",
			struct_name: "ETH",
		},
		extensions: {
			data: [],
		},
	},
];
