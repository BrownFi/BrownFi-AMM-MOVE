// // import SDK, { SdkOptions } from "test-cetus-sui-sdk";
// import { d } from "test-cetus-sui-sdk/dist/utils/numbers";
// import { Tokens } from "../model/coins";
// import { convertToDecimals, getCurrentLP, getDirection, prettyAmount } from "../utils/tokens";
// import { decimalFormat, fixD } from "../utils/utils";
// import { useLiquidityStore } from "../store/liquidity";
// import { useWalletStore } from "../store/wallet";

// export default function () {
// 	const LiquidswapDeployer = config.dev.liquidswapDeployer;
// 	const globalPauseStatusObjectId = config.dev.globalPauseStatusObjectId;
// 	const defaultNetworkOptions: SdkOptions = {
// 		fullRpcUrl: config.dev.rpcUrl,
// 		networkOptions: {
// 			modules: {
// 				LiquidswapDeployer,
// 				globalPauseStatusObjectId,
// 			},
// 		},
// 	};

// 	const faucetObjectId = config.dev.faucetObjectId;

// 	const sdk = new SDK(defaultNetworkOptions);

// 	const wallet = useWalletStore();
// 	const liquidity = useLiquidityStore();
// 	const index = useIndexStore();

// 	// get user wallet account
// 	const getAccount = async (account: string) => {
// 		try {
// 			const list = await sdk.Resources.getSuiObjectOwnedByAddress(account);

// 			console.log("0208###getAccount###list###", list);
// 			const assets: any = {};
// 			list.forEach((item) => {
// 				if (item && item.coinAddress) {
// 					const balance = item ? item.balance.toString() : "0";
// 					const newItem = {
// 						...item,
// 						balance,
// 						// balance: assets[item.coinAddress]?.balance ? d(balance).plus(assets[item.coinAddress].balance).toString() : balance
// 					};
// 					assets[item.coinAddress] = {
// 						...item,
// 						// balance,
// 						balance: assets[item.coinAddress]?.balance ? d(balance).plus(assets[item.coinAddress].balance).toString() : balance,
// 						// ...newItem,
// 						objects: assets[item.coinAddress]?.objects ? [...assets[item.coinAddress].objects, newItem] : [newItem],
// 					};
// 				}
// 			});

// 			return assets;
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	};

// 	const getCoin = () => {
// 		const currentfaucetTime = d(Date.parse(new Date().toString())).div(1000).toDP(0).toNumber();

// 		// const payload = {
// 		//   kind: 'moveCall',
// 		//   data: {
// 		//     packageObjectId: faucetObjectId,
// 		//     module: 'faucet',
// 		//     function: 'faucetLimit',
// 		//     typeArguments: [],
// 		//     gasBudget: 1000,
// 		//     arguments: [
// 		//       '0x6eebc7e7003fadea0ba617305f0038af4445f956',
// 		//       '0xef9253943d66377e5b276c27e7105e7446a6cfa6',
// 		//       '0xe706e09ad4c5864590c4a1bb2500ccdd7b3eb118',
// 		//       '0xf7ff6e079c9f7988272808072fdff049c85f0d3d',
// 		//       currentfaucetTime.toString()
// 		//     ]
// 		//   }
// 		// }

// 		const coinList = config.dev.testCoin;
// 		const payload = {
// 			kind: "moveCall",
// 			data: {
// 				packageObjectId: faucetObjectId,
// 				module: "faucet",
// 				function: "faucetAll",
// 				typeArguments: [],
// 				gasBudget: 1000,
// 				arguments: [...coinList],
// 			},
// 		};

// 		return payload;
// 	};

// 	const getCoinId = async (address: string, amount?: string) => {
// 		const coinItem = wallet.assets[address];
// 		const maxObject = coinItem.objects.reduce((p, v) => (Number(p.balance) < Number(v.balance) ? v : p));
// 		if (d(amount).lte(d(maxObject.balance))) {
// 			return maxObject?.data?.fields?.id?.id;
// 		} else {
// 			const list: any = [];
// 			coinItem.objects.forEach((item) => {
// 				list.push(item?.data?.fields?.id?.id);
// 			});

// 			const id = await mergeCoinObject(address, list, coinItem.balance);
// 			return id;
// 		}
// 	};

// 	const mergeCoinObject = async (coinAddress: string, list: any, amounts: string) => {
// 		const account = wallet.address;
// 		let payload: any = {};
// 		if (coinAddress !== "0x2::sui::SUI") {
// 			payload = {
// 				kind: "pay",
// 				data: {
// 					inputCoins: list,
// 					recipients: [account],
// 					amounts: [Number(amounts)],
// 					// gasPayment: gas_obj_id,
// 					gasBudget: 100000,
// 				},
// 			};
// 		} else {
// 			payload = {
// 				kind: "payAllSui",
// 				data: {
// 					inputCoins: list,
// 					recipient: account,
// 					gasBudget: 100000,
// 				},
// 			};
// 		}
// 		const res = await wallet.currentWallet.signAndExecuteTransaction(payload);
// 		if (res?.effects?.status?.status === "success" || res?.EffectsCert?.effects?.effects?.status?.status === "success") {
// 			if (coinAddress !== "0x2::sui::SUI") {
// 				const newObjectId = res?.effects?.created[0]?.reference?.objectId || res?.EffectsCert?.effects?.effects?.created[0]?.reference?.objectId;
// 				if (newObjectId) return newObjectId;
// 			} else {
// 				const newObjectId = res?.effects?.mutated[0]?.reference?.objectId || res?.EffectsCert?.effects?.effects?.mutated[0]?.reference?.objectId;
// 				if (newObjectId) return newObjectId;
// 			}
// 		} else {
// 			console.error("MergeCoin Error");
// 			return;
// 		}
// 	};

// 	interface calculateImpactParams {
// 		fromToken: Tokens;
// 		toToken: Tokens;
// 		fromAmount: string | number;
// 		toAmount: string | number;
// 		interactiveToken: "from" | "to";
// 	}

// 	// calculate price impact
// 	const calculatePriceImpact = async (params: calculateImpactParams) => {
// 		const currentLP: any = getCurrentLP(
// 			params.fromToken.symbol,
// 			params.toToken.symbol,
// 			useLiquidityStore((state) => state.lpTokens)
// 		);
// 		const direction = getDirection(
// 			params.fromToken.symbol,
// 			params.toToken.symbol,
// 			useLiquidityStore((state) => state.lpTokens)
// 		);
// 		let interactiveToken: "from" | "to" = "from";
// 		if ((direction && params.interactiveToken === "from") || (!direction && params.interactiveToken === "to")) {
// 			interactiveToken = "from";
// 		} else {
// 			interactiveToken = "to";
// 		}
// 		const fromAmount = convertToDecimals(params.fromAmount, params.fromToken.decimals);
// 		const toAmount = convertToDecimals(params.toAmount, params.toToken.decimals);
// 		const result = await sdk.Swap.calculatePriceImpact({
// 			poolObjectId: currentLP.address,
// 			// fromToken: direction ? params.fromToken.address : params.toToken.address,
// 			// toToken: direction ? params.toToken.address : params.fromToken.address,
// 			fromAmount: direction ? fromAmount : toAmount,
// 			toAmount: direction ? toAmount : fromAmount,
// 			interactiveToken,
// 		});

// 		const impact = fixD(Math.abs(Number(result)), 2);

// 		return Number(impact) ? impact : "<0.01";
// 	};

// 	interface calculateRatesParams {
// 		fromToken: Tokens;
// 		toToken: Tokens;
// 		amount: number | string;
// 		interactiveToken: "from" | "to";
// 	}

// 	// swap precomputation
// 	const calculateRates = async (params: calculateRatesParams) => {
// 		const currentLP: any = getCurrentLP(params.fromToken.symbol, params.toToken.symbol, liquidity.lpTokens);
// 		const direction = getDirection(params.fromToken.symbol, params.toToken.symbol, liquidity.lpTokens);
// 		const amount = convertToDecimals(params.amount, params.interactiveToken === "from" ? params.fromToken.decimals : params.toToken.decimals);
// 		const output = await sdk.Swap.calculateRates({
// 			poolObjectId: currentLP.address,
// 			amount: amount.toString(),
// 			feeDenominator: currentLP.feeDenominator,
// 			feeNumerator: currentLP.feeNumerator,
// 			interactiveToken: params.interactiveToken,
// 			direction,
// 		});

// 		const result = prettyAmount(output, params.interactiveToken === "from" ? params.toToken.decimals : params.fromToken.decimals);
// 		return Number(result) > 0 ? result : "InsufficientLiquidity";
// 	};

// 	interface getLiquidityAndCoinYByCoinXParams {
// 		coinX: Tokens;
// 		coinY: Tokens;
// 		amount: string | number;
// 	}
// 	// Add liquidity pre-calculation (note: coinX, coinY are passed in order of input)
// 	const getLiquidityAndCoinYByCoinX = async (params: getLiquidityAndCoinYByCoinXParams) => {
// 		const currentLP: any = getCurrentLP(params.coinX.symbol, params.coinY.symbol, liquidity.lpTokens);
// 		const direction = getDirection(params.coinX.symbol, params.coinY.symbol, liquidity.lpTokens);

// 		const amountX = convertToDecimals(params.amount, params.coinX.decimals);
// 		const result: any = await sdk.Liquidity.getLiquidityAndCoinYByCoinX({
// 			poolObjectId: currentLP.address,
// 			amountX,
// 			direction,
// 		});
// 		if (result == -1) return result;
// 		const prettyLpAmount = decimalFormat(prettyAmount(result.lpAmount.toString(), currentLP.decimals), currentLP.decimals) || "";
// 		const lpAmountView = Number(prettyLpAmount) ? prettyLpAmount : `<${d(1).div(Math.pow(10, currentLP.decimals).toString())}`;

// 		return {
// 			coinYAmount: decimalFormat(prettyAmount(result.coinYAmount.toString(), params.coinY.decimals), params.coinY.decimals),
// 			coinYAmountOrigin: result.coinYAmount,
// 			lpAmount: result.lpAmount.toString(),
// 			lpAmountView,
// 		};
// 	};

// 	interface addLiquidityParams {
// 		coinX: Tokens;
// 		coinY: Tokens;
// 		coinXAmount: string | number;
// 		coinYAmount: string | number;
// 		slippage: number;
// 	}
// 	// Add liquidity request parameter construction (Note: coinX, coinY are passed in order of input)
// 	const createAddLiquidityTransactionPayload = async (params: addLiquidityParams) => {
// 		const currentLP: any = getCurrentLP(params.coinX.symbol, params.coinY.symbol, liquidity.lpTokens);
// 		const coinXAmount = convertToDecimals(params.coinXAmount, params.coinX.decimals).toString();
// 		let coinYAmount = convertToDecimals(params.coinYAmount, params.coinY.decimals).toString();
// 		const coinYRes = await getLiquidityAndCoinYByCoinX({
// 			coinX: params.coinX,
// 			coinY: params.coinY,
// 			amount: params.coinXAmount,
// 		});
// 		if (coinYRes && coinYRes !== -1) {
// 			coinYAmount = fixD(coinYRes.coinYAmountOrigin.toString(), 0) || "0";
// 		}

// 		const direction = currentLP.coinA.address === params.coinX.address ? true : false;

// 		const coinXAmountResult = direction ? coinXAmount : coinYAmount;
// 		const coinYAmountResult = direction ? coinYAmount : coinXAmount;

// 		const coinXObjectId = await getCoinId(currentLP.coinA.address, coinXAmountResult);
// 		const coinYObjectId = await getCoinId(currentLP.coinB.address, coinYAmountResult);

// 		const result = await sdk.Liquidity.createAddLiquidityTransactionPayload({
// 			coinX: currentLP.coinA.address,
// 			coinY: currentLP.coinB.address,
// 			coinXObjectId,
// 			coinYObjectId,
// 			poolObjectId: currentLP.address,
// 			coinXAmount: coinXAmountResult,
// 			coinYAmount: coinYAmountResult,
// 			slippage: params.slippage,
// 		});

// 		return {
// 			kind: "moveCall",
// 			data: result,
// 		};
// 	};

// 	// Get all pool information
// 	const getAllPool = async (poolObjectIdList: any) => {
// 		try {
// 			const res = await sdk.Resources.getAllPool(LiquidswapDeployer, poolObjectIdList);
// 			return res;
// 		} catch (error) {
// 			return [];
// 		}
// 	};

// 	interface getCoinXForLiquidityParams {
// 		coinX: Tokens;
// 		coinY: Tokens;
// 		liquidity: string | number;
// 	}

// 	// Obtain coinX, coinY quantity through liquidity
// 	const getCoinXYForLiquidity = async (params: getCoinXForLiquidityParams) => {
// 		const currentLP: any = getCurrentLP(
// 			params.coinX.symbol,
// 			params.coinY.symbol,
// 			useLiquidityStore((state) => state.lpTokens)
// 		);
// 		const direction = getDirection(
// 			params.coinX.symbol,
// 			params.coinY.symbol,
// 			useLiquidityStore((state) => state.lpTokens)
// 		);

// 		const result = await sdk.Liquidity.getCoinXYForLiquidity({
// 			poolObjectId: currentLP.address,
// 			liquidity: Number(params.liquidity),
// 			direction,
// 		});

// 		return {
// 			coinXAmount: prettyAmount(result.coinXAmount.toString(), params.coinX.decimals),
// 			coinYAmount: prettyAmount(result.coinYAmount.toString(), params.coinY.decimals),
// 		};
// 	};

// 	// Get my LP list
// 	const getMyLpList = async (account: string, poolObjectIdList: any = []) => {
// 		const list = await getAllPool(poolObjectIdList);
// 		// const addressLpTokens = liquidity.value.addressLpTokens
// 		const addressLpTokens = useLiquidityStore((state) => state.addressLpTokens);
// 		const newList: any = [];
// 		for (let i = 0; i < list.length; i++) {
// 			const info = list[i];
// 			const baseInfo = addressLpTokens[info.poolObjectId] || {};
// 			const coinXAmount = prettyAmount(info.coin_a.toString(), baseInfo.coinA.decimals);
// 			const coinYAmount = prettyAmount(info.coin_b.toString(), baseInfo.coinB.decimals);
// 			const lpSupply = info.lpSupply;
// 			const t = d(coinYAmount.toString()).plus(d(coinYAmount.toString()));
// 			const lpPrice = (lpSupply && t.div(lpSupply)) || d(0);
// 			const rate = 1; // Temporarily set to 1, later replaced with the return value of the exchange rate interface
// 			const totalLpUSD = t.mul(rate).toString();
// 			const price = d(coinYAmount.toString()).div(coinXAmount.toString()).toString();

// 			let showTotalLpUSD = true;
// 			if (baseInfo.coinB.symbol.toLowerCase().includes("sui")) {
// 				showTotalLpUSD = false;
// 			}

// 			newList.push({
// 				...info,
// 				...baseInfo,
// 				totalLpUSD,
// 				price,
// 				lpPrice,
// 				totalCoinXAmount: coinXAmount,
// 				totalCoinYAmount: coinYAmount,
// 				address: info.poolObjectId,
// 				showTotalLpUSD,
// 			});
// 		}

// 		if (account) {
// 			const lpList: any = [];
// 			const assets = await getAccount(account);
// 			for (let i = 0; i < newList.length; i++) {
// 				const info = newList[i];
// 				if (assets[info.coinLp]) {
// 					const totalLpUSD = info.totalLpUSD;
// 					const lpPrice = info.lpPrice;
// 					const balance = assets[info.coinLp].balance;
// 					if (!Number(balance)) {
// 						lpList.push({ ...info });
// 						continue;
// 					}
// 					const myLpWithCoinXY = await getCoinXYForLiquidity({
// 						coinX: info.coinA,
// 						coinY: info.coinB,
// 						liquidity: balance,
// 					});
// 					let myBalanceUSD = d(balance).mul(lpPrice);
// 					if (info.coinB.symbol.toLowerCase().includes("sui")) {
// 						myBalanceUSD = d(0);
// 					}
// 					const myshareOfPool = d(balance).div(info.lpSupply).mul(100).toString();
// 					const b = decimalFormat(d(balance).div(Math.pow(10, info.decimals)).toString(), info.decimals);
// 					let newBalance;
// 					if (!Number(b)) {
// 						newBalance = "<0.000000001";
// 					} else {
// 						newBalance = b;
// 					}

// 					lpList.push({
// 						...info,
// 						balance,
// 						balanceOrigin: balance,
// 						myLpBalance: newBalance,
// 						myBalanceUSD: myBalanceUSD.toString(),
// 						myCoinXAmount: decimalFormat(myLpWithCoinXY.coinXAmount, info.coinA.decimals),
// 						myCoinYAmount: decimalFormat(myLpWithCoinXY.coinYAmount, info.coinB.decimals),
// 						myshareOfPool: Number(myshareOfPool) < 0.01 ? "<0.01" : fixD(myshareOfPool, 2),
// 					});
// 				} else {
// 					lpList.push({ ...info });
// 				}
// 			}
// 			return lpList;
// 		}
// 		return newList;
// 	};

// 	interface removeLiquidityParams {
// 		coinX: Tokens;
// 		coinY: Tokens;
// 		liquidity: string | number;
// 		slippage: number;
// 	}
// 	// Get remove liquidity payload
// 	const removeLiquidityTransactionPayload = async (params: removeLiquidityParams) => {
// 		const currentLP: any = getCurrentLP(params.coinX.symbol, params.coinY.symbol, liquidity.myLplist);
// 		const lpObjectId = await getCoinId(currentLP.coinLp, String(params.liquidity));
// 		const result = await sdk.Liquidity.removeLiquidityTransactionPayload({
// 			coinX: currentLP.coinA.address,
// 			coinY: currentLP.coinB.address,
// 			lpObjectId,
// 			poolObjectId: currentLP.address,
// 			liquidity: params.liquidity,
// 			slippage: params.slippage,
// 			direction: true,
// 		});

// 		return {
// 			kind: "moveCall",
// 			data: result,
// 		};
// 	};

// 	interface swapTransactionParams {
// 		fromToken: Tokens;
// 		toToken: Tokens;
// 		fromAmount: string | number;
// 		toAmount: string | number;
// 		interactiveToken: "from" | "to";
// 		slippage: number;
// 	}

// 	// Get swap Payload
// 	const createSwapTransactionPayload = async (params: swapTransactionParams) => {
// 		const currentLP: any = getCurrentLP(params.fromToken.symbol, params.toToken.symbol, liquidity.lpTokens);
// 		const direction = getDirection(params.fromToken.symbol, params.toToken.symbol, liquidity.lpTokens);
// 		let interactiveToken: "from" | "to" = "from";
// 		if ((direction && params.interactiveToken === "from") || (!direction && params.interactiveToken === "to")) {
// 			interactiveToken = "from";
// 		} else {
// 			interactiveToken = "to";
// 		}
// 		const fromAmount = convertToDecimals(params.fromAmount, params.fromToken.decimals);
// 		const toAmount = convertToDecimals(params.toAmount, params.toToken.decimals);
// 		const rate = await calculateRates({
// 			fromToken: params.fromToken,
// 			toToken: params.toToken,
// 			amount: params.interactiveToken === "from" ? params.fromAmount : params.toAmount,
// 			interactiveToken: params.interactiveToken,
// 		});
// 		const toAmountNew = convertToDecimals(rate, params.interactiveToken === "from" ? params.toToken.decimals : params.fromToken.decimals);

// 		const fromAmountResult =
// 			params.interactiveToken === "from" ? fromAmount.toString() : fixD(toAmountNew.plus(toAmountNew.mul(params.slippage)).toString(), 0);
// 		const toAmountResult = params.interactiveToken === "from" ? fixD(toAmountNew.minus(toAmountNew.mul(params.slippage)).toString(), 0) : toAmount.toString();

// 		const payTokenObjectId = await getCoinId(params.fromToken.address, String(fromAmountResult));

// 		const result = await sdk.Swap.createSwapTransactionPayload({
// 			poolObjectId: currentLP.address,
// 			fromToken: currentLP.coinA.address,
// 			toToken: currentLP.coinB.address,
// 			payTokenObjectId,
// 			fromAmount: fromAmountResult,
// 			toAmount: toAmountResult,
// 			interactiveToken: params.interactiveToken,
// 			direction,
// 		});

// 		return {
// 			kind: "moveCall",
// 			data: result,
// 		};
// 	};

// 	interface getLiquidityPoolResourceParams {
// 		coinX: Tokens;
// 		coinY: Tokens;
// 	}

// 	// Obtain LP information, coinX, coinY are transmitted in LP order
// 	const getLiquidityPoolResource = async (params: getLiquidityPoolResourceParams) => {
// 		const currentLP: any = getCurrentLP(params.coinX.symbol, params.coinY.symbol, liquidity.myLplist);
// 		return {
// 			coinXAmount: currentLP?.totalCoinXAmount,
// 			coinYAmount: currentLP?.totalCoinYAmount,
// 		};
// 	};
// 	// Get Price
// 	const getPrice = async (params: getLiquidityPoolResourceParams) => {
// 		const currentLP: any = getCurrentLP(params.coinX.symbol, params.coinY.symbol, liquidity.myLplist);
// 		return currentLP?.price.toString();
// 	};

// 	interface getShareOfPoolParams {
// 		coinX: Tokens;
// 		coinY: Tokens;
// 		currentLpVal: string;
// 	}
// 	// Share of Pool (Add Liquidity)
// 	const getShareOfPool = async (params: getShareOfPoolParams) => {
// 		const currentLP: any = getCurrentLP(params.coinX.symbol, params.coinY.symbol, liquidity.myLplist);
// 		if (currentLP) {
// 			const total = d(currentLP?.lpSupply);
// 			const share = d(params.currentLpVal)
// 				.div(total.plus(d(params.currentLpVal)))
// 				.mul(100);
// 			if (Number(share) > 0.01) return decimalFormat(share.toString(), 2) || "";
// 		}
// 		return "<0.01";
// 	};

// 	const handleTx = (res: any) => {
// 		let tx;
// 		if (res && res.certificate && res.certificate.transactionDigest) {
// 			tx = {
// 				hash: res.certificate.transactionDigest,
// 			};
// 		} else if (res && res.EffectsCert && res.EffectsCert.certificate && res.EffectsCert.certificate.transactionDigest) {
// 			tx = {
// 				hash: res.EffectsCert.certificate.transactionDigest,
// 			};
// 		}
// 		return tx;
// 	};

// 	return {
// 		getCoin,
// 		// getFaucetEventsTime,
// 		getAccount,
// 		calculatePriceImpact,
// 		calculateRates,
// 		getLiquidityAndCoinYByCoinX,
// 		createAddLiquidityTransactionPayload,
// 		getMyLpList,
// 		getCoinXYForLiquidity,
// 		removeLiquidityTransactionPayload,
// 		createSwapTransactionPayload,
// 		getLiquidityPoolResource,
// 		getPrice,
// 		getShareOfPool,
// 		handleTx,
// 	};
// }
