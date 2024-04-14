import { LP_DECIMAL, SUI_COIN_TYPE } from "../constants/constants";
import { Token } from "../model/coins";
import { BIG_TEN, BigNumberInstance } from "./bigNumber";
import { SUILPLIST, SUITOKENS } from "./tokens";
import SUI_TOKEN_ICON from "/images/sui.svg";

export const UNKNOWN_TOKEN_ICON = "https://icones.pro/wp-content/uploads/2021/05/icone-point-d-interrogation-question-noir.png";

export const getTokenIcon = (coinType: string) => {
	if (coinType === SUI_COIN_TYPE) {
		return SUI_TOKEN_ICON;
	} else {
		const findToken = SUITOKENS.find((item) => item.address === coinType);
		if (findToken) return findToken.logoURI;
		return UNKNOWN_TOKEN_ICON;
	}
};

export const formatBalance = (coin: Token) => {
	if (coin.coinType === SUI_COIN_TYPE) {
		return Number(coin.totalBalance) / 10 ** 9;
	} else {
		return Number(coin.totalBalance) / 10 ** 6;
	}
};

export const getSymbol = (coinType: string) => {
	if (coinType === SUI_COIN_TYPE) {
		return "SUI";
	} else {
		const findToken = SUITOKENS.find((item) => item.address === coinType);
		if (findToken) return findToken.symbol;
		return "UNKNOWN";
	}
};

export const getDecimalAmount = (amount: string | number, coinType?: string, decimals = LP_DECIMAL) => {
	if (coinType === SUI_COIN_TYPE) {
		return BigNumberInstance(amount).times(BIG_TEN.pow(decimals)).toFixed();
	} else {
		// TODO
		return BigNumberInstance(amount).times(BIG_TEN.pow(6)).toFixed();
	}
};

export const getBalanceAmount = (coin: Token, decimals = LP_DECIMAL) => {
	if (coin.coinType === SUI_COIN_TYPE) {
		return BigNumberInstance(coin.totalBalance).div(BIG_TEN.pow(decimals));
	} else {
		return BigNumberInstance(coin.totalBalance).div(BIG_TEN.pow(6));
	}
};

export const checkLPValid = (coinX: string, coinY: string) => {
	const isLPExist = SUILPLIST.find((item) => item.coinA.address === coinX && item.coinB.address === coinY);
	if (isLPExist) return true;
	return false;
};
