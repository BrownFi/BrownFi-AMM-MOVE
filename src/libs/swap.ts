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

const main = async () => {
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

		const coinAType = "0x2::sui::SUI";
		// const coinAType =
		// 	"0x571ae7fc8e3b557f4297e20fedcfd8319c8ab46c3a777a143622900a79b02164::coins::USDT";
		const coinBType = "0x23a21e3ce259d81cc21a4e4e4e0dad7be73855f2c3a73a1ad7fea1e1d248fa94::mock_token::MOCK_TOKEN";

		const account = keypair.toSuiAddress();
		let txb = new TransactionBlock();

		const { coin: coinObjectAId, tx } = await handleGetCoinAmount("10", account, coinAType, txb);
		const { coin: coinObjectBId, tx: tx2 } = await handleGetCoinAmount("100", account, coinBType, txb);

		console.log("🚀 ~ file: add-lp.ts:63 ~ main ~ coinObjectAId:", coinObjectAId);

		console.log("🚀 ~ file: add-lp.ts:71 ~ main ~ coinObjectBId:", coinObjectBId);
		// bcs.bytes(coinAType)
		// let left_bytes = bcs::to_bytes(left);
		// let right_bytes = bcs::to_bytes(right);

		// compare_u8_vector(left_bytes, right_bytes)

		const rest = txb.moveCall({
			target: `0x58188d537f33ac825e7199a2fc5c6d22558ffd89a2320be292591026a8efc03a::interface::swap`,
			typeArguments: [coinAType, coinBType],
			arguments: [
				txb.object("0x79ea07ba61d03cd009d72ffbafde572d09d33de6408696e638ea95bceee18a56"),
				isObject(coinObjectAId) ? coinObjectAId : tx.object(coinObjectAId),
				txb.pure(1),
			],
		});
		txb.setGasBudget(1000000000);
		// tx.transferObjects([rest, coinObjectAId], tx.pure(keypair.toSuiAddress()));
		txb.setSender(keypair.toSuiAddress());

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

main();
