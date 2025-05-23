export const timeDiff = (timestamp: number) => {
	const datetime = new Date(timestamp * 1000).getTime();
	const now = new Date().getTime();

	if (isNaN(datetime)) {
		return "";
	}

	let milisec_diff = datetime - now;
	if (datetime < now) {
		milisec_diff = now - datetime;
	}

	let msec = milisec_diff;
	const days = Math.floor(milisec_diff / 1000 / 60 / 60 / 24);
	msec -= days * 1000 * 60 * 60 * 24;
	const hh = Math.floor(msec / 1000 / 60 / 60);
	msec -= hh * 1000 * 60 * 60;
	const mm = Math.floor(msec / 1000 / 60);
	msec -= mm * 1000 * 60;
	const ss = Math.floor(msec / 1000);
	msec -= ss * 1000;

	if (days > 0) return days + "D";

	return `${hh > 0 ? `${hh} H` : ""} ${mm}M`;
};

export const SOL_PRICE = 132;

export const formatSmartNumber = (num: number | string): string => {
	if (typeof num === "string") {
		num = Number(num);
	}

	if (num >= 10) {
		return parseFloat(num.toFixed(1)).toString();
	} else if (num >= 1) {
		return parseFloat(num.toFixed(2)).toString();
	} else {
		const numberDecimalAfterZero = 3;

		// if (Number(num) >= 0.1) {
		// 	numberDecimalAfterZero = 4;
		// }

		const strNumber = num.toFixed(13).toString();
		const arr = strNumber.split(".");
		if (arr.length === 1) {
			return num.toString();
		}
		const decimal = arr[1];
		//find first non-zero number
		let index = 0;
		while (index < decimal.length && decimal[index] === "0") {
			index++;
		}
		if (index === decimal.length) {
			return parseFloat(num.toString()).toString();
		}

		let threeDecimal = decimal.slice(index, index + numberDecimalAfterZero);

		threeDecimal = Number(threeDecimal.split("").reverse().join(""))
			.toString()
			.split("")
			.reverse()
			.join("");

		return `${arr[0]}.${decimal.slice(0, index)}${threeDecimal}`;
	}
};

export function numberWithCommas(x: number | string | undefined) {
	// return !x
	// 	? "0"
	// 	: formatSmartNumber(x)
	// 			.toString()
	// 			.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
	// 			.replace(/\.0$/, "");
	return !x
		? "0"
		: new Intl.NumberFormat("en-US", {
				maximumSignificantDigits: 9,
		  }).format(
				+formatSmartNumber(parseFloat(x.toString()).toFixed(7)).toString()
		  );
}

export function numberFormatter(num: number | string, digits: number) {
	const lookup = [
		{ value: 1, symbol: "" },
		{ value: 1e3, symbol: "k" },
		{ value: 1e6, symbol: "M" },
		{ value: 1e9, symbol: "G" },
		{ value: 1e12, symbol: "T" },
		{ value: 1e15, symbol: "P" },
		{ value: 1e18, symbol: "E" },
	];
	const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
	const item = lookup.findLast((item) => +num >= item.value);
	return item
		? (+num / item.value)
				.toFixed(digits)
				.replace(regexp, "")
				.concat(item.symbol)
		: "0";
}

export const DEFAULT_LIMIT = 10;
