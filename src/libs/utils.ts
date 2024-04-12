import { BIG_TEN, BigNumberInstance } from "./BigNumber";

export const orderByKey = (array: any[], key: string, sortBy: "desc" | "asc") => {
	if (!array?.length) {
		return;
	}
	let swapped;
	const compareFunctionName = sortBy === "desc" ? "isLessThan" : "isGreaterThan";
	do {
		swapped = false;
		for (let i = 0; i < array.length - 1; i++) {
			if (BigNumberInstance(array[i][key])[compareFunctionName](array[i + 1][key])) {
				let temp = array[i];
				array[i] = array[i + 1];
				array[i + 1] = temp;
				swapped = true;
			}
		}
	} while (swapped);
	return array;
};
