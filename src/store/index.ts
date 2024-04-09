// import { create } from "zustand";
// import Cookies from "cookies-ts";

// const cookies = new Cookies();

// interface IIndexStore {
// 	slippage: string;
// 	isShowSuccess: boolean;
// 	isShowRejected: boolean;
// 	isShowWaiting: boolean;
// 	currentTransactionDesc: string;
// 	currentTransactionTxid: string;
// 	theme: string;
// 	chainName: string;
// 	positionNum: number;
// 	statsData: any;
// 	topPoolsList: any;
// 	topTokensList: any;
// 	lang: string;
// 	addressLpTokens: any;
// 	transactionList: any;
// }

// export const useIndexStore = create<IIndexStore>()((set, get) => ({
// 	slippage: localStorage.getItem("slippage") || "0.5",
// 	isShowSuccess: false,
// 	isShowRejected: false,
// 	isShowWaiting: false,
// 	currentTransactionDesc: "",
// 	currentTransactionTxid: "",
// 	theme: "",
// 	chainName: "",
// 	positionNum: 0,
// 	statsData: {},
// 	topPoolsList: [],
// 	topTokensList: [],
// 	lang: cookies.get("lang") || "en",
// 	addressLpTokens: {},
// 	transactionList: JSON.parse(localStorage.getItem("transactionList") || "[]") || [],
// 	setSlippage: (slippage) => {
// 		set({ slippage: slippage });
// 		localStorage.setItem("slippage", slippage);
// 	},
// 	setPositiomNum: () => set((state) => ({ positionNum: state.positionNum + 1 })),
// 	setTheme: (theme) => {
// 		set({ theme: theme });
// 		if (theme == "sui") {
// 			set({ chainName: "Sui" });
// 			localStorage.setItem("chainName", "Sui");
// 		} else if (theme == "sui2") {
// 			set({ chainName: "Sui2" });
// 			localStorage.setItem("chainName", "Sui2");
// 		}
// 	},
// 	setTransactionDesc: (status) => set({ currentTransactionDesc: status }),
// 	setTransactionTxid: (status) => set({ currentTransactionTxid: status }),
// 	getStatsData: async () => {
// 		let addressLpTokens: any = [];
// 		const { data } = await fetch(`${config[get().chainName || "Sui"].api}/v1/swap/count`).then((rsp) => rsp.json());
// 		set({ statsData: data });
// 		set({ topPoolsList: data.pools });
// 		set({ topTokensList: data.tokens });
// 		addressLpTokens = Object.fromEntries(data.pools.map((item) => [item.name, item]));
// 		set({ addressLpTokens: addressLpTokens });
// 	},
// 	setLang: (status) => {
// 		cookies.set("lang", status);
// 		set({ lang: status });
// 	},
// 	setTransactionList: (trans) => {
// 		set((state) => ({ transactionList: { ...state.transactionList, trans } }));
// 		localStorage.setItem("transactionList", JSON.stringify(get().transactionList));
// 	},
// 	clearTransactionList: () => {
// 		const list = get().transactionList.filter((ele) => ele.chainName !== get().chainName);
// 		set({ transactionList: list });
// 		localStorage.setItem("transactionList", list.length > 0 ? JSON.stringify(list) : "");
// 	},
// }));
