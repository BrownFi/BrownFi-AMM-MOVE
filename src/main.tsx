import "./index.css";
import "@mysten/dapp-kit/dist/index.css";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from "./theme";
import { HashRouter } from "react-router-dom";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./lib/queryClient";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
	<StrictMode>
		<FixedGlobalStyle />
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider
				defaultNetwork="sui:devnet"
				networks={{
					"sui:testnet": { url: getFullnodeUrl("testnet") },
					"sui:mainnet": { url: getFullnodeUrl("mainnet") },
					"sui:devnet": { url: getFullnodeUrl("devnet") },
				}}
			>
				<WalletProvider>
					<ThemeProvider>
						<ThemedGlobalStyle />
						<HashRouter>
							<App />
						</HashRouter>
					</ThemeProvider>
				</WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
	</StrictMode>
);
