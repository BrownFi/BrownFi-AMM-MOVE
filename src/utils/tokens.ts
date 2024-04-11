import { decimalsMultiplier, d } from "test-cetus-sui-sdk/dist/utils/numbers";

const faucetObjectId = "0x9fb972059f12bcdded441399300076d7cff7d9946669d3a79b5fb837e2c49b09";

export const SUITOKENS = [
	{
		address: "0x23a21e3ce259d81cc21a4e4e4e0dad7be73855f2c3a73a1ad7fea1e1d248fa94::mock_token::MOCK_TOKEN",
		calculate_decimals: 9,
		decimals: 9,
		logoURI: "https://icones.pro/wp-content/uploads/2021/05/icone-point-d-interrogation-question-noir.png",
		name: "MOCK TOKEN",
		show_decimals: 9,
		symbol: "MOCK",
	},
	{
		address: `${faucetObjectId}::usdt::USDT`,
		calculate_decimals: 6,
		decimals: 6,
		logoURI: "https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::usdt::USDT/icon.png",
		name: "USDT",
		show_decimals: 6,
		symbol: "USDT",
	},
	{
		address: `${faucetObjectId}::usdc::USDC`,
		calculate_decimals: 6,
		decimals: 6,
		logoURI: "https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::usdc::USDC/icon.png",
		name: "USDC",
		show_decimals: 6,
		symbol: "USDC",
	},
	{
		address: `${faucetObjectId}::btc::BTC`,
		calculate_decimals: 8,
		decimals: 8,
		logoURI:
			// eslint-disable-next-line max-len
			"https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::btc::BTC/icon.png",
		name: "BTC",
		show_decimals: 8,
		symbol: "BTC",
	},
	{
		address: `${faucetObjectId}::eth::ETH`,
		calculate_decimals: 8,
		decimals: 8,
		logoURI:
			// eslint-disable-next-line max-len
			"https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::eth::ETH/icon.png",
		name: "ETH",
		show_decimals: 8,
		symbol: "ETH",
	},
	{
		address: `${faucetObjectId}::bnb::BNB`,
		calculate_decimals: 8,
		decimals: 8,
		logoURI: "https://icones.pro/wp-content/uploads/2021/05/icone-point-d-interrogation-question-noir.png",
		name: "BNB",
		show_decimals: 8,
		symbol: "BNB",
	},
	{
		address: `${faucetObjectId}::dai::DAI`,
		calculate_decimals: 8,
		decimals: 8,
		logoURI: "https://icones.pro/wp-content/uploads/2021/05/icone-point-d-interrogation-question-noir.png",
		name: "DAI",
		show_decimals: 8,
		symbol: "DAI",
	},
];

export const SUILPLIST = [
	{
		address: "0x213dd10da0863ee6deaa7678016d1dadb9883f7b7ec596b958d50b98fddaf5bd",
		coinA: SUITOKENS[3],
		coinB: SUITOKENS[4],
		decimals: 6,
		fee: "0.002",
		feeDenominator: "1000",
		feeNumerator: "2",
		name: "BTC-ETH",
		symbol: "BTC-ETH",
	},
	{
		address: "0x31e0b2118ba1247d72aa51a6ed18dfc27dd52995a165dff92238248b469654de",
		coinA: SUITOKENS[4],
		coinB: SUITOKENS[1],
		decimals: 6,
		fee: "0.002",
		feeDenominator: "1000",
		feeNumerator: "2",
		name: "ETH-USDT",
		symbol: "ETH-USDT",
	},
	{
		address: "0x77f46f7569bbd36fed3856b563e08c8e37e58ad8ca8f14d6b0cfada935c2f668",
		coinA: SUITOKENS[5],
		coinB: SUITOKENS[1],
		decimals: 6,
		fee: "0.002",
		feeDenominator: "1000",
		feeNumerator: "2",
		name: "BNB-USDT",
		symbol: "BNB-USDT",
	},
	{
		address: "0x793034d129de9924c1aea0e3f32fa579f0cc0df9e9a65dfaad98991cb3f7699a",
		coinA: SUITOKENS[3],
		coinB: SUITOKENS[1],
		decimals: 6,
		fee: "0.002",
		feeDenominator: "1000",
		feeNumerator: "2",
		name: "BTC-USDT",
		symbol: "BTC-USDT",
	},
	{
		address: "0x831f8f32c0ab0a34dde5e12c1097c26215789d297a576b8dbe1ae9176920460a",
		coinA: SUITOKENS[6],
		coinB: SUITOKENS[4],
		decimals: 6,
		fee: "0.002",
		feeDenominator: "1000",
		feeNumerator: "2",
		name: "DAI-ETH",
		symbol: "DAI-ETH",
	},
	{
		address: "0xa67488093e6fd47d39dae9f8a84fdd0ce93dc65f34da38519a7126c56f8ddb8b",
		coinA: SUITOKENS[5],
		coinB: SUITOKENS[2],
		decimals: 6,
		fee: "0.002",
		feeDenominator: "1000",
		feeNumerator: "2",
		name: "BNB-USDC",
		symbol: "BNB-USDC",
	},
	{
		address: "0xc441666f679f22f7124552c764db9612d5481f0032b563aefca4df66f586637a",
		coinA: SUITOKENS[6],
		coinB: SUITOKENS[2],
		decimals: 6,
		fee: "0.002",
		feeDenominator: "1000",
		feeNumerator: "2",
		name: "DAI-USDC",
		symbol: "DAI-USDC",
	},

	{
		address: "0xd8932bfc9ddd3a109c736937d21b8b548475e090ded5409ff073b044c54615c4",
		coinA: SUITOKENS[2],
		coinB: SUITOKENS[1],
		decimals: 6,
		fee: "0.002",
		feeDenominator: "1000",
		feeNumerator: "2",
		name: "USDC-USDT",
		symbol: "USDC-USDT",
	},
	{
		address: "0xea105e33f0eb7d930ab10bf0e06bb6877775977884aebfcb014c1c4b0c0fddec",
		coinA: SUITOKENS[3],
		coinB: SUITOKENS[6],
		decimals: 6,
		fee: "0.002",
		feeDenominator: "1000",
		feeNumerator: "2",
		name: "BTC-DAI",
		symbol: "BTC-DAI",
	},
];

export const isInTokens = (address: string, tokens: any) => {
	// @ts-ignore
	const result = Object.values(tokens).filter((item) => item.address === address);
	return result && result.length > 0 ? true : false;
};

export const isInLpTokens = (address: string, tokens: any) => {
	// @ts-ignore
	const result = Object.values(tokens).filter((item) => item.address === address);
	return result && result.length > 0 ? true : false;
};

export function prettyAmount(amount: string | number, decimals: number) {
	const mul = decimalsMultiplier(decimals);

	return d(amount).div(mul).toString();
}

export function convertToDecimals(amount: string | number, decimals: number) {
	const mul = decimalsMultiplier(decimals);

	return d(amount).mul(mul);
}

export function getCurrentLP(fromCoin: string, toCoin: string, lpTokens: any) {
	const result = Object.values(lpTokens).filter((item) => {
		// @ts-ignore
		return (fromCoin === item.coinA.symbol && toCoin === item.coinB.symbol) || (fromCoin === item.coinB.symbol && toCoin === item.coinA.symbol);
	});
	return (result && result[0]) || null;
}

export function getInteractiveToken(fromCoin: string, toCoin: string, lpTokens: any) {
	if (lpTokens[`${fromCoin}-${toCoin}`]) {
		return "from";
	} else if (lpTokens[`${toCoin}-${fromCoin}`]) {
		return "to";
	}
	return "from";
}

export function getDirection(fromCoin: string, toCoin: string, lpTokens: any) {
	if (lpTokens[`${fromCoin}-${toCoin}`]) {
		return true;
	}
	return false;
}
