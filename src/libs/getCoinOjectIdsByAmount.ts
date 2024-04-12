import { CoinStruct, PaginatedCoins, SuiClient } from "@mysten/sui.js/client";
import { orderByKey } from "./utils";
import { BigNumberInstance } from "./BigNumber";

export const getCoinOjectIdsByAmount = async (
	address: string,
	amount: bigint,
	coinType: string
): Promise<{
	objectIds: string[];
	objectCoins: CoinStruct[];
	balance: string;
}> => {
	let coinBalances: CoinStruct[] = [];
	let hasNextPage = true;
	let nextCursor = undefined;
	while (hasNextPage) {
		try {
			const suiClient = new SuiClient({
				url: "https://fullnode.devnet.sui.io:443",
			});
			const coins: PaginatedCoins = await suiClient.getCoins({
				owner: address,
				coinType,
				cursor: nextCursor,
			});
			coinBalances = [...coinBalances, ...coins.data];
			hasNextPage = coins.hasNextPage;
			// nextCursor = coins.nextCursor;
		} catch (error) {
			console.error("Error fetching data:", error);
			hasNextPage = false;
		}
	}

	// sort coin balance before get object id
	const coinObj = orderByKey(
		coinBalances.map((item) => {
			return {
				...item,
				balance: item.balance,
			};
		}),
		"balance",
		"desc"
	);
	let balance = "0";
	let objectIds = [] as any;
	let objectCoins = [] as any;
	for (const coin of coinObj ?? []) {
		balance = BigNumberInstance(coin.balance).plus(balance).toFixed();
		objectIds.push(coin.coinObjectId);
		objectCoins.push(coin);
		if (BigNumberInstance(balance).isGreaterThanOrEqualTo(amount.toString())) {
			break;
		}
	}
	return { objectIds, balance, objectCoins };
};
