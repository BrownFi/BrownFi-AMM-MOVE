import { NetworkConfiguration } from "@omnibtc/omniswap-sui-sdk";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

export const suiClient = new SuiClient({ url: getFullnodeUrl("devnet") });

export const DEVNET_CONFIG = new NetworkConfiguration(
	"devnet",
	"https://fullnode.devnet.sui.io:443",
	"0xdf76602fadcb531adc61ce48dd11e4de7038a824dd7e7a3ecfb510222884e2b2",
	"0xdf76602fadcb531adc61ce48dd11e4de7038a824dd7e7a3ecfb510222884e2b2",
	"",
	"",
	""
);
