import { getPureSerializationType, TransactionBlock } from "@mysten/sui.js/dist/cjs/transactions";
import { suiClient } from "../utils/config";
import { isObject } from "lodash";

const getPools = async () => {
	const objects = await suiClient.getDynamicFields({
		parentId: "0x35e1d651e5c3b5c5a8f397e23397088551ae0f8a8a0dbe002737fb51bc7c52d2",
	});
	const ids = objects.data.map((_) => _.objectId);
	const pools = await suiClient.multiGetObjects({
		ids,
		options: {
			showContent: true,
			showType: true,
			showDisplay: true,
			showOwner: true,
		},
	});
	const poolList: any[] = [];
	objects?.data?.forEach((pool) => {
		poolList.push({
			pool_addr: pool["objectId"],
			pool_type: pool["objectType"],
		});
	});
	console.log(poolList);
};

export const initTxBlock = async (
	packageId: string,
	moduleName: string,
	functionName: string,
	params: any[],
	types?: string[],
	tx?: TransactionBlock
): Promise<any> => {
	if (!tx) {
		tx = new TransactionBlock();
	}

	const functionDetails = await suiClient.getNormalizedMoveModule({
		package: packageId,
		module: moduleName,
	});

	const args: any =
		params?.map((param: any, i: number) => {
			return isObject(param)
				? param
				: getPureSerializationType(functionDetails.exposedFunctions[functionName]["parameters"][i], param)
				? tx.pure(param)
				: tx.object(param);
		}) ?? [];
	tx.moveCall({
		target: `${packageId}::${moduleName}::${functionName}`,
		typeArguments: types ?? [],
		arguments: args,
	});
	// tx.moveCall({
	//   target: `$0x2::coin::zero`,
	//   typeArguments: types ?? [],
	//   arguments: args,
	// });
	return tx;
};
