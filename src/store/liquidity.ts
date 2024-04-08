import { create } from "zustand";
import { getMyLpList } from "../hooks/useSuiContracts";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

interface LiquidityState {
	currentPositionInfo: any;
	liquidityList: any;
	myLplist: any;
	tokens: any;
	lpTokens: any;
	cmmLpTokens: any;
	addressLpTokens: any;
	addressTokens: any;
}

export const useLiquidityStore = create<LiquidityState>()((set, get) => ({
	currentPositionInfo: {},
	liquidityList: [],
	myLplist: [],
	tokens: {},
	lpTokens: {},
	cmmLpTokens: [],
	addressLpTokens: {},
	addressTokens: {},
	setCurrentLiquidity: (liquidityInfo: any) => set({ currentPositionInfo: liquidityInfo }),
	setLiquidityList: (data: any) => set({ liquidityList: data }),
	setMyLplist: async (account: any) => {
		const lpBaseList = Object.values(get().lpTokens);
		const poolObjectIdList = lpBaseList.map((item: any) => {
			return item.address;
		});
		const mylpList = await getMyLpList(account, poolObjectIdList);
		const resultList: any = [];
		console.log(mylpList, "====>mylpList");
		lpBaseList.forEach((item: any) => {
			const myLpItem = mylpList.filter((litem: any) => litem.address === item.address)[0];
			if (myLpItem) {
				resultList.push({
					...item,
					...myLpItem,
				});
			} else {
				resultList.push({ ...item });
			}
		});

		set({ myLplist: resultList.sort((a, b) => b.totalLpUSD - a.totalLpUSD) });
	},
	setTokens: async (data) => {
		const result = {};
		data.forEach((item) => {
			result[item.symbol] = item;
		});
		set({ tokens: data });
	},
	getTokenList: async (chainName: string) => {
		let result: any = [];
		let addressResult: any = [];
		const { data } = useSWR(`${config[chainName].api}/${chainName.toLowerCase() === "sui2" ? "sui" : chainName.toLowerCase()}/config/token-list`, fetcher);
		if (data) {
			result = Object.fromEntries(data.map((item) => [item.symbol, item]));
			addressResult = Object.fromEntries(data.map((item) => [item.address, item]));
		}
		set({ tokens: result });
		set({ addressTokens: addressResult });
	},
	getLpList: async (chainName: string) => {
		let result: any = [];
		let addressResult: any = [];
		set({ lpTokens: [] });
		const { data } = useSWR(`${config[chainName].api}/${chainName.toLowerCase() === "sui2" ? "sui" : chainName.toLowerCase()}/config/lp-list`, fetcher);
		if (data) {
			result = Object.fromEntries(
				data.map((item) => [
					item.symbol,
					{
						...item,
						fee: item.fee * 100,
					},
				])
			);
			addressResult = Object.fromEntries(
				data.map((item) => [
					item.address,
					{
						...item,
						fee: item.fee * 100,
					},
				])
			);
		}
		set({ lpTokens: result });
		set({ addressLpTokens: addressResult });
	},
	getCmmLpList: async (chainName: string) => {
		const { data } = useSWR(`${config[chainName].cmmApi}/v2/${chainName.toLowerCase() === "sui2" ? "sui" : chainName.toLowerCase()}/config/lp-list`, fetcher);
		set({ cmmLpTokens: data || [] });
	},
	resetTokenAndLp: () =>
		set(() => ({
			currentPositionInfo: {},
			liquidityList: [],
			myLplist: [],
			tokens: {},
			lpTokens: {},
			cmmLpTokens: [],
			addressLpTokens: {},
			addressTokens: {},
		})),
}));
