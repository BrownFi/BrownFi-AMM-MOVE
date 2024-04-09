import { create } from "zustand";

const AUTO_REFRESH_TIME = 5;

interface IWalletStore {
	loading: boolean;
	autoRefreshTime: number;
	countdown: number;
	connected: boolean;
	suiConnected: boolean;
	address: string;
	suiAddress: string;
	platform: string;
	isShowWalletModal: boolean;
	walletName: string;
	suiWalletName: string;
	currentWallet: any;
	suiCurrentWallet: any;
	walletIcon: string;
	suiWalletIcon: string;
	switchWallet: boolean;
	assets: any;
	walletIconName: string;
	suiWalletIconName: string;
	walletNetwork: string;
}

export const useWalletStore = create<IWalletStore>()((set, get) => ({
	loading: false,
	autoRefreshTime: 5,
	countdown: 0,
	connected: false,
	suiConnected: false,
	address: "",
	suiAddress: "",
	platform: "",
	isShowWalletModal: false,
	walletName: "",
	suiWalletName: "",
	currentWallet: null as any,
	suiCurrentWallet: null as any,
	walletIcon: "",
	suiWalletIcon: "",
	switchWallet: false,
	assets: {},
	walletIconName: "",
	suiWalletIconName: "",
	walletNetwork: "",
	setLoading: (loading: boolean) => {
		if (loading) set({ countdown: AUTO_REFRESH_TIME });
		set({ loading: loading });
		if (!loading) {
			set({ countdown: 0 });
		}
	},
	setCountdown: (countdown: number) => set({ countdown: countdown }),
	setWalletStatus: () => set({ connected: true }),
	setSwitchWallet: (status) => set({ switchWallet: status }),
	setIsShowModal: (status) => set({ isShowWalletModal: status }),
	setWalletInfo: (status, walletName) =>
		set({
			connected: status,
			platform: walletName,
		}),
	setCurrentWallet: (data) => {
		if (data.wallet) {
			set({
				currentWallet: data.wallet,
				connected: data.isConnected,
				address: data.account,
				walletIcon: data.icon,
				walletName: data.wallet.name,
			});
			if (data.platform === "Sui") {
				set({
					suiCurrentWallet: data.wallet,
					suiConnected: data.isConnected,
					suiAddress: data.account,
					suiWalletIcon: data.icon,
					suiWalletName: data.wallet.name,
				});
			}
		} else {
			set({
				currentWallet: null,
				connected: false,
				address: "",
				walletIcon: "",
				walletName: "",
			});
			if (data.platform === "Sui") {
				set({
					suiCurrentWallet: null,
					suiConnected: false,
					suiAddress: "",
					suiWalletIcon: "",
					suiWalletName: "",
				});
			}
		}
	},
	setAssets: (data) => set({ assets: data }),
	setWalletIconName: (value) => {
		set({ walletIconName: value });
		localStorage.setItem("walletIconName", value);
	},
	setNetwork: (value) => set({ walletNetwork: value }),
}));
