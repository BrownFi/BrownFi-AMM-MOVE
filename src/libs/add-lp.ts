import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SuiClient } from "@mysten/sui.js/client";
import { handleGetCoinAmount } from "./handleGetCoinAmount";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { decodeSuiPrivateKey, encodeSuiPrivateKey } from "@mysten/sui.js/cryptography";
import { fromHEX } from "@mysten/sui.js/utils";
import { isObject } from "lodash";
import { bcs } from "@mysten/sui.js/bcs";

function toHex(str: string) {
	var result = "";
	for (var i = 0; i < str.length; i++) {
		result += str.charCodeAt(i).toString(16);
	}
	return result;
}

export const addLiquidity = async () => {
	try {
		const suiClient = new SuiClient({
			url: "https://fullnode.devnet.sui.io:443",
		});

		// const poolsObjects = await suiClient.getDynamicFieldObject({
		// 	parentId: "",
		// 	name: "",
		// });
		// console.log("🚀 ~ file: add-lp.ts:14 ~ main ~ poolsObjects:", poolsObjects);
		// const pools:Pool[] = [];
		// poolsObjects?.data?.forEach(pool=> {
		//   pools.push({
		//     pool_addr: pool['objectId'],
		//     pool_type: pool['objectType'],
		//   })
		// })

		const keypair = Ed25519Keypair.fromSecretKey(fromHEX("b89dd1d83371e777f543e336c04450d5c8f94b9d3dac6ce6cea85af3d12cc3c2"));

		console.log("🚀 ~ file: add-lp.ts:27 ~ main ~ keypair:", keypair.getPublicKey().toSuiAddress());

		// const coinAType =
		// 	"0x9fb972059f12bcdded441399300076d7cff7d9946669d3a79b5fb837e2c49b09::coins:USDT";
		const coinAType = "0x571ae7fc8e3b557f4297e20fedcfd8319c8ab46c3a777a143622900a79b02164::coins::USDT";
		const coinBType = "0x23a21e3ce259d81cc21a4e4e4e0dad7be73855f2c3a73a1ad7fea1e1d248fa94::mock_token::MOCK_TOKEN";

		const account = keypair.toSuiAddress();
		let txb = new TransactionBlock();

		const { coin: coinObjectAId, tx } = await handleGetCoinAmount("100000", account, coinAType, txb);
		const { coin: coinObjectBId, tx: tx2 } = await handleGetCoinAmount("100000", account, coinBType, txb);

		console.log("🚀 ~ file: add-lp.ts:63 ~ main ~ coinObjectAId:", coinObjectAId);

		console.log("🚀 ~ file: add-lp.ts:71 ~ main ~ coinObjectBId:", coinObjectBId);
		// bcs.bytes(coinAType)
		// let left_bytes = bcs::to_bytes(left);
		// let right_bytes = bcs::to_bytes(right);

		// compare_u8_vector(left_bytes, right_bytes)

		txb.moveCall({
			target: `0xdf9a156750a94787b8a36a950d5cfb165bc69126495626da46a050fd145b9ce8::interface::add_liquidity`,
			typeArguments: [coinAType, coinBType],
			arguments: [
				txb.object("0xa9d3cc6866642735b92e5627dc3657fc914341f5cbd833092889adffc925719a"),
				isObject(coinObjectAId) ? coinObjectAId : tx.object(coinObjectAId),
				txb.pure(1),

				isObject(coinObjectBId) ? coinObjectBId : tx.object(coinObjectBId),
				txb.pure(1),
			],
		});
		txb.setSender(keypair.toSuiAddress());
		txb.setGasBudget(1000000000);

		const bytes = await txb.build({ client: suiClient });

		const serializedSignature = (await keypair.signTransactionBlock(bytes)).signature;

		let res = await suiClient.executeTransactionBlock({
			transactionBlock: bytes,
			signature: serializedSignature,
		});
		console.log(res);
	} catch (error) {
		console.log("🚀 ~ file: add-lp.js:6 ~ main ~ error:", error);
	}
};
