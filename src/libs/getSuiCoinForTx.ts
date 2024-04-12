import { CoinStruct } from "@mysten/sui.js/client";
import { TransactionArgument, TransactionBlock } from "@mysten/sui.js/transactions";

export const getSuiCoinForTx = async (
	objectCoins: CoinStruct[],
	amount: string | number,
	tx: TransactionBlock
): Promise<{ tx: TransactionBlock; coin: string | TransactionArgument }> => {
	let coin;
	tx.setGasPayment(
		objectCoins.map((coin) => ({
			objectId: coin.coinObjectId,
			digest: coin.digest,
			version: coin.version,
		}))
	);

	coin = tx.splitCoins(tx.gas, [tx.pure(amount)]);

	return { tx, coin };
};
