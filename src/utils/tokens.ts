import { SUI_COIN_TYPE } from "../constants/constants";
import SUI_IMAGE from "/images/sui.svg";

export const AMM_PACKAGE =
	"0xa14b715c7ba1e47e7e2ace0e7458cb3321ae95e7dae37bff12f13ec6c1a12e9a";

export const FACTORY_OBJECT =
	"0xc17fd90fdd580c146d3109e968bc82f1f9871a7a98156be5adebef9725d214e3";

export const FACTORY_TABLE_ID =
	"0x623c337b52df29f90d427a4cb5c38979fea3cbbd4b05ca16b596014daf2762cc";

export const SUI_USDT_POOL_ID =
	"0xffab5e9ded9fb777c71f3b31f4083b419941632de8ca60e941240c3661520aca";

export const SUITOKENS = [
	{
		address:
			"0xc1b7fd3a6162026011afe9bece237c95a4fd6fce970d77e4dc08e85bdfb48b8f::usdt::USDT",
		calculate_decimals: 9,
		decimals: 9,
		logoURI: "https://www.svgrepo.com/show/367256/usdt.svg",
		name: "USDT",
		show_decimals: 9,
		symbol: "USDT",
	},
	// {
	// 	address:
	// 		"0x6aa4b8b1e15071dd3156519d33a58f284075b9c65e43f08586fccec8f4ed2225::coins::XBTC",
	// 	calculate_decimals: 6,
	// 	decimals: 6,
	// 	logoURI: "https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg",
	// 	name: "XBTC",
	// 	show_decimals: 6,
	// 	symbol: "XBTC",
	// },
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
		address:
			"0x92a39064d02b0408781d57801e54d3bb91964aef1a1bb9a44511b5adf92030fc",
		coinA: SUITOKENS[1],
		coinB: SUITOKENS[0],
		name: "SUI-USDT",
		symbol: "SUI-USDT",
	},
	// {
	// 	address:
	// 		"0x8a350d1cced30aa4c64dda0f053b514b59cf08e2be39403678488fd2a693940b",
	// 	coinA: SUITOKENS[1],
	// 	coinB: SUITOKENS[0],
	// 	name: "SUI-MOCK",
	// 	symbol: "SUI-MOCK",
	// },
	// {
	// 	address:
	// 		"0xf9d359d68d9be5ba04637e7377714d4b560e1bc8187ada73acd4919159ce221d",
	// 	coinA: SUITOKENS[1],
	// 	coinB: {
	// 		address:
	// 			"0x571ae7fc8e3b557f4297e20fedcfd8319c8ab46c3a777a143622900a79b02164::coins::USDT",
	// 		calculate_decimals: 6,
	// 		decimals: 6,
	// 		logoURI:
	// 			"https://archive.cetus.zone/assets/devnet/0x133a5219829f1859323a3bb2dbe04420ef0b807d::usdt::USDT/icon.png",
	// 		name: "USDT",
	// 		show_decimals: 6,
	// 		symbol: "USDT",
	// 	},
	// 	name: "SUI-USDT",
	// 	symbol: "SUI-USDT",
	// },
];

export const isInTokens = (address: string, tokens: any) => {
	// @ts-ignore
	const result = Object.values(tokens).filter(
		(item) => item.address === address
	);
	return result && result.length > 0 ? true : false;
};

export const isInLpTokens = (address: string, tokens: any) => {
	// @ts-ignore
	const result = Object.values(tokens).filter(
		(item) => item.address === address
	);
	return result && result.length > 0 ? true : false;
};

export function getCurrentLP(fromCoin: string, toCoin: string, lpTokens: any) {
	const result = Object.values(lpTokens).filter((item) => {
		// @ts-ignore
		return (
			(fromCoin === item.coinA.symbol && toCoin === item.coinB.symbol) ||
			(fromCoin === item.coinB.symbol && toCoin === item.coinA.symbol)
		);
	});
	return (result && result[0]) || null;
}

export function getInteractiveToken(
	fromCoin: string,
	toCoin: string,
	lpTokens: any
) {
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
