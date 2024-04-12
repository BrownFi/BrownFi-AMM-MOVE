import { suiClient } from "../utils/config";
import { isObject } from "lodash";
import { TransactionBlock, getPureSerializationType } from "@mysten/sui.js/transactions";

export const getPools = async () => {
	const objects = await suiClient.getDynamicFields({
		parentId: "0x02efaff4e9c6c8957ef2fffb264d2895270b1850b7fdc60213ba29e40035d0ce",
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
