import SDK, { SdkOptions } from "test-cetus-sui-sdk";
import { d } from "test-cetus-sui-sdk/dist/utils/numbers";
import { Tokens } from "../model/coins";
import { convertToDecimals, getCurrentLP, getDirection, prettyAmount } from "../utils/tokens";
import { decimalFormat, fixD } from "../utils/utils";
import { useLiquidityStore } from "../store/liquidity";

const LiquidswapDeployer = config.dev.liquidswapDeployer;
const globalPauseStatusObjectId = config.dev.globalPauseStatusObjectId;
const defaultNetworkOptions: SdkOptions = {
	fullRpcUrl: config.dev.rpcUrl,
	networkOptions: {
		modules: {
			LiquidswapDeployer,
			globalPauseStatusObjectId,
		},
	},
};

const faucetObjectId = config.dev.faucetObjectId;

const sdk = new SDK(defaultNetworkOptions);

// get user wallet account
export const getAccount = async (account: string) => {
	try {
		const list = await sdk.Resources.getSuiObjectOwnedByAddress(account);

		console.log("0208###getAccount###list###", list);
		const assets: any = {};
		list.forEach((item) => {
			if (item && item.coinAddress) {
				const balance = item ? item.balance.toString() : "0";
				const newItem = {
					...item,
					balance,
					// balance: assets[item.coinAddress]?.balance ? d(balance).plus(assets[item.coinAddress].balance).toString() : balance
				};
				assets[item.coinAddress] = {
					...item,
					// balance,
					balance: assets[item.coinAddress]?.balance ? d(balance).plus(assets[item.coinAddress].balance).toString() : balance,
					// ...newItem,
					objects: assets[item.coinAddress]?.objects ? [...assets[item.coinAddress].objects, newItem] : [newItem],
				};
			}
		});

		return assets;
	} catch (error) {
		console.log(error);
	}
};

export const getCoin = () => {
	const currentfaucetTime = d(Date.parse(new Date().toString())).div(1000).toDP(0).toNumber();

	// const payload = {
	//   kind: 'moveCall',
	//   data: {
	//     packageObjectId: faucetObjectId,
	//     module: 'faucet',
	//     function: 'faucetLimit',
	//     typeArguments: [],
	//     gasBudget: 1000,
	//     arguments: [
	//       '0x6eebc7e7003fadea0ba617305f0038af4445f956',
	//       '0xef9253943d66377e5b276c27e7105e7446a6cfa6',
	//       '0xe706e09ad4c5864590c4a1bb2500ccdd7b3eb118',
	//       '0xf7ff6e079c9f7988272808072fdff049c85f0d3d',
	//       currentfaucetTime.toString()
	//     ]
	//   }
	// }

	const coinList = config.dev.testCoin;
	const payload = {
		kind: "moveCall",
		data: {
			packageObjectId: faucetObjectId,
			module: "faucet",
			function: "faucetAll",
			typeArguments: [],
			gasBudget: 1000,
			arguments: [...coinList],
		},
	};

	return payload;
};

// const getCoinId = async (address: string, amount?: string) => {
//     const coinItem = wallet.value.assets[address]
//     const maxObject = coinItem.objects.reduce((p, v) => (Number(p.balance) < Number(v.balance) ? v : p))
//     if (d(amount).lte(d(maxObject.balance))) {
//       return maxObject?.data?.fields?.id?.id
//     } else {
//       const list: any = []
//       coinItem.objects.forEach(item => {
//         list.push(item?.data?.fields?.id?.id)
//       })

//       const id = await mergeCoinObject(address, list, coinItem.balance)
//       return id
//     }
//   }

interface calculateImpactParams {
	fromToken: Tokens;
	toToken: Tokens;
	fromAmount: string | number;
	toAmount: string | number;
	interactiveToken: "from" | "to";
}

// calculate price impact
export const calculatePriceImpact = async (params: calculateImpactParams) => {
	const currentLP: any = getCurrentLP(
		params.fromToken.symbol,
		params.toToken.symbol,
		useLiquidityStore((state) => state.lpTokens)
	);
	const direction = getDirection(
		params.fromToken.symbol,
		params.toToken.symbol,
		useLiquidityStore((state) => state.lpTokens)
	);
	let interactiveToken: "from" | "to" = "from";
	if ((direction && params.interactiveToken === "from") || (!direction && params.interactiveToken === "to")) {
		interactiveToken = "from";
	} else {
		interactiveToken = "to";
	}
	const fromAmount = convertToDecimals(params.fromAmount, params.fromToken.decimals);
	const toAmount = convertToDecimals(params.toAmount, params.toToken.decimals);
	const result = await sdk.Swap.calculatePriceImpact({
		poolObjectId: currentLP.address,
		// fromToken: direction ? params.fromToken.address : params.toToken.address,
		// toToken: direction ? params.toToken.address : params.fromToken.address,
		fromAmount: direction ? fromAmount : toAmount,
		toAmount: direction ? toAmount : fromAmount,
		interactiveToken,
	});

	const impact = fixD(Math.abs(Number(result)), 2);

	return Number(impact) ? impact : "<0.01";
};

interface getCoinXForLiquidityParams {
	coinX: Tokens;
	coinY: Tokens;
	liquidity: string | number;
}

// Obtain coinX, coinY quantity through liquidity
export const getCoinXYForLiquidity = async (params: getCoinXForLiquidityParams) => {
	const currentLP: any = getCurrentLP(
		params.coinX.symbol,
		params.coinY.symbol,
		useLiquidityStore((state) => state.lpTokens)
	);
	const direction = getDirection(
		params.coinX.symbol,
		params.coinY.symbol,
		useLiquidityStore((state) => state.lpTokens)
	);

	const result = await sdk.Liquidity.getCoinXYForLiquidity({
		poolObjectId: currentLP.address,
		liquidity: Number(params.liquidity),
		direction,
	});

	return {
		coinXAmount: prettyAmount(result.coinXAmount.toString(), params.coinX.decimals),
		coinYAmount: prettyAmount(result.coinYAmount.toString(), params.coinY.decimals),
	};
};

// Get all pool information
export const getAllPool = async (poolObjectIdList: any) => {
	try {
		const res = await sdk.Resources.getAllPool(LiquidswapDeployer, poolObjectIdList);
		return res;
	} catch (error) {
		return [];
	}
};

// Get my LP list
export const getMyLpList = async (account: string, poolObjectIdList: any = []) => {
	const list = await getAllPool(poolObjectIdList);
	// const addressLpTokens = liquidity.value.addressLpTokens
	const addressLpTokens = useLiquidityStore((state) => state.addressLpTokens);
	const newList: any = [];
	for (let i = 0; i < list.length; i++) {
		const info = list[i];
		const baseInfo = addressLpTokens[info.poolObjectId] || {};
		const coinXAmount = prettyAmount(info.coin_a.toString(), baseInfo.coinA.decimals);
		const coinYAmount = prettyAmount(info.coin_b.toString(), baseInfo.coinB.decimals);
		const lpSupply = info.lpSupply;
		const t = d(coinYAmount.toString()).plus(d(coinYAmount.toString()));
		const lpPrice = (lpSupply && t.div(lpSupply)) || d(0);
		const rate = 1; // Temporarily set to 1, later replaced with the return value of the exchange rate interface
		const totalLpUSD = t.mul(rate).toString();
		const price = d(coinYAmount.toString()).div(coinXAmount.toString()).toString();

		let showTotalLpUSD = true;
		if (baseInfo.coinB.symbol.toLowerCase().includes("sui")) {
			showTotalLpUSD = false;
		}

		newList.push({
			...info,
			...baseInfo,
			totalLpUSD,
			price,
			lpPrice,
			totalCoinXAmount: coinXAmount,
			totalCoinYAmount: coinYAmount,
			address: info.poolObjectId,
			showTotalLpUSD,
		});
	}

	if (account) {
		const lpList: any = [];
		const assets = await getAccount(account);
		for (let i = 0; i < newList.length; i++) {
			const info = newList[i];
			if (assets[info.coinLp]) {
				const totalLpUSD = info.totalLpUSD;
				const lpPrice = info.lpPrice;
				const balance = assets[info.coinLp].balance;
				if (!Number(balance)) {
					lpList.push({ ...info });
					continue;
				}
				const myLpWithCoinXY = await getCoinXYForLiquidity({
					coinX: info.coinA,
					coinY: info.coinB,
					liquidity: balance,
				});
				let myBalanceUSD = d(balance).mul(lpPrice);
				if (info.coinB.symbol.toLowerCase().includes("sui")) {
					myBalanceUSD = d(0);
				}
				const myshareOfPool = d(balance).div(info.lpSupply).mul(100).toString();
				const b = decimalFormat(d(balance).div(Math.pow(10, info.decimals)).toString(), info.decimals);
				let newBalance;
				if (!Number(b)) {
					newBalance = "<0.000000001";
				} else {
					newBalance = b;
				}

				lpList.push({
					...info,
					balance,
					balanceOrigin: balance,
					myLpBalance: newBalance,
					myBalanceUSD: myBalanceUSD.toString(),
					myCoinXAmount: decimalFormat(myLpWithCoinXY.coinXAmount, info.coinA.decimals),
					myCoinYAmount: decimalFormat(myLpWithCoinXY.coinYAmount, info.coinB.decimals),
					myshareOfPool: Number(myshareOfPool) < 0.01 ? "<0.01" : fixD(myshareOfPool, 2),
				});
			} else {
				lpList.push({ ...info });
			}
		}
		return lpList;
	}
	return newList;
};
