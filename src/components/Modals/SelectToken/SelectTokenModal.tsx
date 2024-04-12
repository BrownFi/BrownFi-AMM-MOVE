import { useState, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { Input } from "antd";
import { SelectTokenModalHeader } from "./components/SelectTokenHeader";
import SearchIcon from "../../Icons/SearchIcon";
import { Token } from "../../../model/coins";
import { getTokenIcon } from "../../../utils/utils";
import { SUITOKENS } from "../../../utils/tokens";
import useSWR from "swr";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { suiClient } from "../../../utils/config";
import { Field } from "../../../model/inputs";

const SelectTokenModal = (props: any) => {
	const currentAccount = useCurrentAccount();
	const { isShowing, hide, token0, token1, setToken, typeModal, balances } = props;
	const [searchValue, setSearchValue] = useState("");

	const handleInputChange = (event: any) => {
		let tokenAddress = event.target.value;
		setSearchValue(tokenAddress);
	};

	const handleSelectToken = (coinType: string) => {
		if (typeModal === 1) {
			if (coinType === token0.coinType) return;
			setToken({
				[Field.INPUT]: token1,
				[Field.OUTPUT]: token0,
			});
		} else {
			if (coinType === token1.coinType) return;
			setToken({
				[Field.INPUT]: token1,
				[Field.OUTPUT]: token0,
			});
		}
		hide(false);
	};

	const useOutsideAlerter = (ref: any) => {
		useEffect(() => {
			/**
			 * Alert if clicked on outside of element
			 */
			function handleClickOutside(event: any) {
				if (ref.current && !ref.current.contains(event.target)) {
					hide(false);
				}
			}
			// Bind the event listener
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				// Unbind the event listener on clean up
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, []);
	};

	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef);

	// const searchToken = (token: any) => {
	// 	const strFirstTwo = token.slice(0, 2);
	// 	// let tempArr = [];
	// 	if (strFirstTwo === "0x") {
	// 		// mockDataTokenTest.map((item) => {
	// 		//   if (token === item.address) tempArr.push(item);
	// 		// });
	// 		return mockDataTokenTest.filter(
	// 			(item: any) => {
	// 				const searchTerm = token.toLowerCase();
	// 				const itemValue =
	// 					item.address.toLowerCase();
	// 				return itemValue.includes(searchTerm);
	// 			}
	// 		);
	// 	} else {
	// 		// mockDataTokenTest.map((item) => {
	// 		//   if (token.toLowerCase() === item.name.toLowerCase()) tempArr.push(item);
	// 		// });
	// 		return mockDataTokenTest.filter(
	// 			(item: any) => {
	// 				const searchTerm = token.toLowerCase();
	// 				const itemValue =
	// 					item.name.toLowerCase();
	// 				return itemValue.includes(searchTerm);
	// 			}
	// 		);
	// 	}
	// 	// return tempArr;
	// };
	return (
		<div>
			<div className={`modal-overlay`}>
				<div
					ref={wrapperRef}
					className={twMerge("flex flex-col items-center gap-3 modal-content-token")}
				>
					<SelectTokenModalHeader close={() => hide(false)} />
					<Input
						prefix={<SearchIcon />}
						placeholder="Search"
						value={searchValue}
						onChange={handleInputChange}
						className="input-pl bg-[#131216] p-3 text-sm font-normal border-none text-[rgba(255,255,255,0.5)]"
					/>
					<div className="flex flex-wrap content-start items-start gap-3 self-stretch cursor-pointer">
						<div className="flex items-center gap-2 border-[1px] border-[#323135] bg-[#1D1C21] py-[7px] px-3 shadow-[0_2px_12px_0px_rgba(11,14,25,0.12)]">
							<img
								src={getTokenIcon(token0)}
								alt=""
								className="h-5 w-5"
							/>
							<span className="text-sm font-medium">{token0.name}</span>
						</div>
						<div className="flex items-center gap-2 border-[1px] border-[#323135] bg-[#1D1C21] py-[7px] px-3 shadow-[0_2px_12px_0px_rgba(11,14,25,0.12)]">
							<img
								src={getTokenIcon(token1)}
								alt=""
								className="h-5 w-5"
							/>
							<span className="text-sm font-medium">{token1.name}</span>
						</div>
					</div>
					<div className="flex flex-col items-center gap-3 self-stretch">
						<div className="flex justify-between items-center self-stretch text-sm font-medium text-[rgba(255,255,255,0.5)]">
							<span>Asset</span>
							<span>Balance</span>
						</div>
					</div>
					<div className="flex flex-col items-start gap-1 self-stretch">
						{searchValue === "" && (
							<>
								{SUITOKENS.map((item: any, index: number) => {
									return (
										<div
											key={index}
											className="flex items-center justify-between self-stretch border-b-[1px] bg-[#131216] p-3 border-b-[#323135] shadow-[0_2px_12px_0px_rgba(11,14,25,0.12)] cursor-pointer hover:border-[#27E3AB] hover:border-[1px]"
											onClick={() => {
												handleSelectToken(item.address);
											}}
										>
											<div className="flex items-center gap-2">
												<img
													src={getTokenIcon(item.address)}
													alt={item.name}
													className="h-7 w-7"
												/>
												<div className="flex flex-col items-start justify-center gap-[1px]">
													<span className="text-base font-medium">{item.symbol}</span>
													<span className="text-xs font-medium text-[rgba(255,255,255,0.5)]">{item.name}</span>
												</div>
											</div>
											{/* <div className="flex flex-col items-start justify-center gap-[1px]">
													<span className="text-base font-medium">
														{item.name ===
														balances?.[0].token
															.name
															? balances?.[0]?.toSignificant(
																	3
															  )
															: balances?.[1]?.toSignificant(
																	3
															  )}
													</span>
													<span className="text-xs font-medium text-[rgba(255,255,255,0.5)]">
														--
													</span>
												</div> */}
										</div>
									);
								})}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SelectTokenModal;
