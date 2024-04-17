import { SUI_COIN_TYPE } from "../constants/constants";
import SUI_IMAGE from "/images/sui.svg";

export const SUITOKENS = [
	{
		address: "0x70f7bbfa1c8fb5c9f4294027958c7bb19cea373169ae58031f45f3b8273d0c82::mock_usdt::MOCK_USDT",
		calculate_decimals: 6,
		decimals: 6,
		logoURI: "https://icones.pro/wp-content/uploads/2021/05/icone-point-d-interrogation-question-noir.png",
		name: "MOCK TOKEN",
		show_decimals: 6,
		symbol: "MOCK",
	},
	{
		address: SUI_COIN_TYPE,
		calculate_decimals: 9,
		decimals: 9,
		logoURI: SUI_IMAGE,
		name: "SUI",
		show_decimals: 9,
		symbol: "SUI",
	},
];

export const SUILPLIST = [
	{
		address: "0x38f8f926f85596c6bfb4b4f11e9a2eb198155ba2ed80003b55e5d1f92f7a6c74",
		coinA: {
			address: "0x571ae7fc8e3b557f4297e20fedcfd8319c8ab46c3a777a143622900a79b02164::coins::USDT",
			calculate_decimals: 6,
			decimals: 6,
			logoURI: "https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::usdt::USDT/icon.png",
			name: "USDT",
			show_decimals: 6,
			symbol: "USDT",
		},
		coinB: SUITOKENS[0],
		name: "USDT-MOCK",
		symbol: "USDT-MOCK",
	},
	{
		address: "0x8a350d1cced30aa4c64dda0f053b514b59cf08e2be39403678488fd2a693940b",
		coinA: SUITOKENS[1],
		coinB: SUITOKENS[0],
		name: "SUI-MOCK",
		symbol: "SUI-MOCK",
	},
	{
		address: "0xf9d359d68d9be5ba04637e7377714d4b560e1bc8187ada73acd4919159ce221d",
		coinA: SUITOKENS[1],
		coinB: {
			address: "0x571ae7fc8e3b557f4297e20fedcfd8319c8ab46c3a777a143622900a79b02164::coins::USDT",
			calculate_decimals: 6,
			decimals: 6,
			logoURI: "https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::usdt::USDT/icon.png",
			name: "USDT",
			show_decimals: 6,
			symbol: "USDT",
		},
		name: "SUI-USDT",
		symbol: "SUI-USDT",
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
