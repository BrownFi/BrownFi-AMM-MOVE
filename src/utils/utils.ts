const fixDEAdd = (num: any, precision: any, autoFix = true) => {
	if (`${num}` === "0") {
		// if (!window.parseFloat(precision) || !autoFix) return 0;
		if (!parseFloat(precision) || !autoFix) return 0;
		return "0.".padEnd(precision + 2, "0");
	}
	if (!num) return "--";

	const number = parseFloat(num);
	const strN = num.toString();
	const flag = number < 0;
	let result = strN;

	if (strN.toLowerCase().includes("e")) {
		const n = strN.match(/(\d+?)(?:\.(\d*))?e([+-])(\d+)/);
		const nl = n[1];
		const nr = n[2];
		const type = n[3]; //  + / -
		const floatN = n[4];

		let params = "";
		let pr = nr ? nr.substr(floatN) : "";

		if (pr) pr = `.${pr}`;
		if (type !== "-") {
			for (let i = 0; i < floatN; i += 1) {
				const p = nr[i] || "0";
				params += p;
			}
			result = nl + params + pr;
		} else {
			let strl = "0";
			for (let i = 0; i < floatN; i += 1) {
				const p = nl[nl.length - i - 1] || "0";
				params = p + params;
			}
			if (nl.length > floatN) strl = nl.substr(0, nl.length - floatN);
			result = `${strl}.${params}${nr}`;
		}
	}

	if (precision && autoFix) {
		let pal = `${result.split(".")[0]}.`;
		const par = result.split(".")[1] || "";

		for (let i = 0; i < precision; i += 1) {
			pal += par[i] || "0";
		}
		result = pal;
	}

	if (result.length > 14) {
		const arry = result.split(".");
		if (arry[0].length > 14) {
			result = `${arry[0].slice(0, 14)}+`;
		} else {
			result = result.slice(0, 13);
			if (result.indexOf(".") === 12) {
				result = result.slice(0, 12);
			}
		}
	}

	return `${flag ? "-" : ""}${result}`;
};

export function fixD(num: any, precision: any) {
	precision = precision > -1 ? precision : 0;
	if (`${num}` === "0") {
		// if (!window.parseFloat(precision)) {
		if (!parseFloat(precision)) {
			return "0";
		}
		return "0.".padEnd(precision + 2, "0");
	}
	if (!num) {
		return "--";
	}
	let flag = false;
	if (parseFloat(num) < 0) {
		flag = true;
	}

	const newnum = `${Math.abs(parseFloat(num))}`;
	if (newnum === "NaN") {
		return "--";
	}
	let fixNum: any = newnum;
	if (newnum.toLowerCase().includes("e")) {
		if (newnum.toLowerCase().includes("+")) return fixDEAdd(newnum, precision);
		const a = newnum.toLowerCase().split("e");
		let b = a[0];
		const c = Math.abs(parseFloat(a[1]));
		let d = "";
		let h = b.length;
		let i;
		if (a[0].split(".")[1]) {
			b = a[0].split(".")[0] + a[0].split(".")[1];
			h = a[0].split(".")[0].length;
		}
		for (i = 0; i < c - h; i += 1) {
			d += "0";
		}
		fixNum = `0.${d}${b}`;
	}
	if (`${precision}` !== "0" && !precision) {
		return (flag ? "-" : "") + fixNum;
	}
	if (`${parseFloat(num)}` === "NaN") {
		return (flag ? "-" : "") + fixNum;
	}
	const fNum = fixNum.split(".");
	if (precision === 0) {
		fixNum = parseInt(fixNum, 10);
	} else if (precision > 0 && fNum[1]) {
		if (fNum[1].length > precision) {
			if (fNum[1].includes("999999999")) {
				const s = parseFloat(fixNum).toFixed(precision + 1);
				fixNum = s.slice(0, s.length - 1);
			} else {
				fixNum = `${fNum[0]}.${fNum[1].slice(0, precision)}`;
			}
		} else {
			fixNum = parseFloat(fixNum).toFixed(precision);
		}
	} else {
		fixNum = parseFloat(fixNum).toFixed(precision);
	}
	if (fixNum.length >= 14 && fixNum.includes(".")) {
		const arry = fixNum.split(".");
		if (arry[0].length > 14) {
			fixNum = `${arry[0].slice(0, 14)}+`;
		} else {
			fixNum = fixNum.slice(0, 13);
			if (fixNum.indexOf(".") === 12) {
				fixNum = fixNum.slice(0, 12);
			}
		}
	}
	return (flag ? "-" : "") + fixNum;
}
function removeEndingZero(num: string) {
	return num.replace(/(\s|0|\.)+$/g, "");
}
export function decimalFormat(num: string, d: number) {
	if (!Number(num)) {
		return 0;
	}

	if (!String(num).includes(".")) {
		return num;
	}

	const arr = String(num).split(".");

	const minimum = Math.pow(10, -d);
	if (Number(num) < minimum) {
		if (removeEndingZero(arr[1])) {
			return arr[0] + "." + removeEndingZero(arr[1]);
		} else {
			return arr[0];
		}
	}

	const result = fixD(num, d);
	const arr2 = String(result).split(".");

	if (result === "--") {
		return "--";
	}

	if (removeEndingZero(String(arr2[1]))) {
		return arr2[0] + "." + removeEndingZero(String(arr2[1]));
	} else {
		return arr2[0];
	}
}

export const addCommom = (num, len) => {
	if (isNaN(num) || !num) return num;
	num = String(num);
	if (!isNaN(len)) {
		if (len === 0) {
			num = num.split(".")[0];
		}
		return num.replace(/(\d+)(\.\d+)?/, (a, b, c) => {
			return b.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,") + (c ? c.slice(0, len + 1) : "");
		});
	} else {
		return num.replace(/^\d+/, (a) => {
			return a.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
		});
	}
};

export function thousands(num: any) {
	if (num) {
		const str = num.toString();
		const reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
		return str.replace(reg, "$1,");
	}
}

export function checkNullObj(obj: object) {
	return Object.keys(obj).length === 0;
}
