import { css, styled } from "styled-components";
import { colors } from "../theme";
import AppBody from "../AppBody";
import { AutoColumn } from "./Column";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { suiClient } from "../utils/config";
import { useState } from "react";
import { Field } from "../model/inputs";
import { SUITOKENS } from "../utils/tokens";
import { SUI_COIN_TYPE } from "../constants/constants";
import useSWR from "swr";
import { Input, Skeleton } from "antd";
import ArrowDown from "./Icons/ArrowDown";
import SwapIcon from "./Icons/SwapIcon";
import { twMerge } from "tailwind-merge";
import { getBalanceAmount, getDecimalAmount, getSymbol, getTokenIcon } from "../utils/utils";
import SelectTokenModal from "./Modals/SelectToken/SelectTokenModal";
import ArrowBack from "./Icons/ArrowBack";
import { TransactionBlock } from "@mysten/sui.js/transactions";

const LightDiv = styled.div`
	color: ${colors().text1};
`;
export const Wrapper = styled.div`
	position: relative;
	padding: 26px 25px 26px;
`;

export const ArrowWrapper = styled.div<{ clickable: boolean }>`
	padding: 4px;
	border-radius: 50%;
	height: 32px;
	width: 32px;
	position: relative;
	margin-top: -10px;
	margin-bottom: -10px;
	left: calc(50% - 16px);
	/* transform: rotate(90deg); */
	background-color: ${({ theme }) => theme.bg0};
	border: 1px solid ${({ theme }) => theme.primary1};
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	${({ clickable }) =>
		clickable
			? css`
					:hover {
						cursor: pointer;
						opacity: 0.8;
					}
			  `
			: null}
`;

export type CreateAddLiquidTXPayloadParams = {
	coin_x: string;
	coin_y: string;
	coin_x_objectIds: string[];
	coin_y_objectIds: string[];
	coin_x_amount: number;
	coin_y_amount: number;
	gasPaymentObjectId?: string;
	slippage: number;
};

export default function AddLiquidity() {
	const currentAccount = useCurrentAccount();

	const [isShowTokenModal, setIsShowTokenModal] = useState<boolean>(false);
	const [typeModal, setTypeModal] = useState<number>(1);
	const [isShowReviewModal, setIsShowReviewModal] = useState<boolean>(false);
	const [isApprove, setIsApprove] = useState<boolean>(false);
	const [approveTx, setApproveTx] = useState<string | undefined>(undefined);
	const [disabled, setDisabled] = useState(false);
	const [k, setK] = useState(2);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [typedValue, setTypedValue] = useState("");
	const [independentField, setIndependentField] = useState<Field>(Field.INPUT);

	const [tokens, setTokens] = useState<{
		[key in Field]: string | undefined;
	}>({
		[Field.INPUT]: SUI_COIN_TYPE,
		[Field.OUTPUT]: SUITOKENS[0].address,
	});

	const onChangeK = (newValue: number) => {
		setK(newValue);
	};

	const [tokenAmounts, setTokenAmounts] = useState<{ [key in Field]: string }>({
		[Field.INPUT]: "",
		[Field.OUTPUT]: "",
	});

	const [parsedTokenAmounts, setParsedTokenAmounts] = useState<{
		[key in Field]: any | undefined;
	}>({
		[Field.INPUT]: undefined,
		[Field.OUTPUT]: undefined,
	});

	const { data: balances, isLoading } = useSWR<(any | undefined)[]>([currentAccount, tokens[Field.INPUT], tokens[Field.OUTPUT]], async () => {
		if (!currentAccount) return [];
		return Promise.all(
			[tokens[Field.INPUT], tokens[Field.OUTPUT]].map(async (t) => {
				if (!t) return undefined;
				const res = await suiClient.getBalance({
					owner: currentAccount.address,
					coinType: t,
				});
				return res;
			})
		);
	});

	const packageObjectId = "0xdf76602fadcb531adc61ce48dd11e4de7038a824dd7e7a3ecfb510222884e2b2";

	const addLiquidity = async (): Promise<any> => {
		console.log(getDecimalAmount(typedValue));

		const tx = new TransactionBlock();
		tx.setSender("0xd4575fae90c78ad3b781f4d686bab3c16b089f03e2b4f5c932b18fda481a335d");
		tx.setGasPrice(5);
		tx.setGasBudget(100);
		tx.moveCall({
			target: "0xdf76602fadcb531adc61ce48dd11e4de7038a824dd7e7a3ecfb510222884e2b2::interface::add_liquidity",
			arguments: [
				{ kind: "Input", value: "0xdf76602fadcb531adc61ce48dd11e4de7038a824dd7e7a3ecfb510222884e2b2::implements::Global", index: 0, type: "object" }, //packageObjectid::module::func
				{ kind: "Input", value: "0x9fb972059f12bcdded441399300076d7cff7d9946669d3a79b5fb837e2c49b09::usdt::USDT", index: 1, type: "object" }, // CoinIn
				{ kind: "Input", value: 510555301, index: 2, type: "pure" }, // Amount coin in
				{ kind: "Input", value: "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN", index: 3, type: "object" }, // CoinOut
				{ kind: "Input", value: 800000, index: 4, type: "pure" }, // Amout coin out
			],
			typeArguments: ["0x2::sui::SUI", ""],
		});
		const txb = await tx.build();
		return txb;
	};

	const handleAddLiquidity = async () => {
		const txb = await addLiquidity();
		// const signedTx = await suiClient.signAndExecuteTransactionBlock({
		// 	signer: ''
		// 	transactionBlock: txb,
		// });
	};

	handleAddLiquidity();

	const handleChangeAmounts = (value: string, independentField: Field) => {
		if (isNaN(+value)) return;
		setTypedValue(value);
		setIndependentField(independentField);
	};

	return (
		<>
			<AppBody>
				<div className="flex flex-col items-start gap-[10px] self-stretch px-6 pt-6">
					<div className="flex items-center gap-3 self-stretch text-white cursor-pointer">
						<ArrowBack />
						<span className="text-2xl !font-['Russo_One'] leading-[29px]">Add Liquidity</span>
					</div>
					<div className="flex justify-center items-center gap-[10px] p-2 self-stretch bg-[rgba(39,227,171,0.10)]">
						<span className="text-xs text-[#27E3AB] flex-1 font-medium font-['Montserrat'] leading-[18px]">
							<b>Tip:</b> When you add liquidity, you will receive pool tokens representing your position.
							<br /> These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.
						</span>
					</div>
				</div>
				<Wrapper id="swap-page">
					<AutoColumn
						gap={"md"}
						// justify="center"
					>
						<div className="flex w-full flex-col items-center gap-2">
							<div className="flex flex-col items-start gap-5 self-stretch bg-[#131216] p-4 self-stretch">
								<div className="flex justify-between items-center self-stretch">
									<span className="text-lg font-normal text-white font-['Russo_One']">You Pay</span>
									<div className="flex items-center gap-1 text-base font-normal">
										<span>Balance:</span>
										{/* <span>{balances && balances?.length > 0 ? formatBalance(balances[0]) : ""}</span> */}
										<span>{balances && balances.length > 0 ? `${getBalanceAmount(balances[0])}` : "--"}</span>
									</div>
								</div>
								<div className="flex flex-col items-start gap-[2px] self-stretch">
									<div className="flex justify-between items-center self-stretch">
										<div className="flex justify-between items-center self-stretch">
											<Input
												placeholder="0.0"
												className="border-none px-0 text-xl font-bold max-w-[150px] text-[#C6C6C6]"
												value={independentField === Field.INPUT ? typedValue : ""}
												onChange={(e) => handleChangeAmounts(e.target.value, Field.INPUT)}
											/>
										</div>
										<div
											className="flex justify-between items-center bg-[#1D1C21] py-[7px] px-3 cursor-pointer shadow-[0_2px_12px_0px_rgba(11,14,25,0.12)] w-[153px]"
											onClick={() => {
												setTypeModal(1);
												setIsShowTokenModal(true);
											}}
										>
											<div className="flex items-center gap-2">
												<img
													src={getTokenIcon(tokens[Field.INPUT] ?? "")}
													alt=""
													className="h-5 w-5"
												/>
												<span className="text-sm font-medium">{getSymbol(tokens[Field.INPUT] ?? "")}</span>
											</div>
											<ArrowDown />
										</div>
									</div>
									<div className="flex items-center gap-1 text-sm font-medium text-[rgba(255,255,255,0.50)]">
										{/* <span>
								{!!trade
									? `~${
											Number(
												trade?.inputAmount.toSignificant(
													2
												)
											) *
											Number(
												trade?.executionPrice.toSignificant(
													2
												)
											)
									  }`
									: "--"}
							</span> */}
										--
									</div>
								</div>
							</div>
							<SwapIcon
								handleChangeToken={() => {
									setTokens({
										[Field.INPUT]: tokens[Field.OUTPUT],
										[Field.OUTPUT]: tokens[Field.INPUT],
									});
								}}
							/>
							{/* To */}
							<div className="flex flex-col items-start gap-5 self-stretch bg-[#131216] p-4">
								<div className="flex justify-between items-center self-stretch">
									<span className="text-lg font-normal text-white font-['Russo_One']">Your Receive</span>
									<div className="flex items-center gap-1 text-base font-normal">
										<span>Balance:</span>
										<span className={isLoading ? "hidden" : ""}>{balances && balances.length > 0 ? `${getBalanceAmount(balances[1])}` : "--"}</span>
										<Skeleton.Input
											className={!isLoading ? "!hidden" : ""}
											active
											size="small"
										/>
									</div>
								</div>
								<div className="flex flex-col items-start gap-[2px] self-stretch">
									<div className="flex justify-between items-center self-stretch">
										<div className="flex justify-between items-center self-stretch">
											<Input
												placeholder="0.0"
												className={twMerge(
													"border-none px-0 text-xl max-w-[150px] font-medium text-[#27E3AB]"
													// isLoadingTrade && "hidden"
												)}
												value={independentField === Field.OUTPUT ? typedValue : ""}
												onChange={(e) => handleChangeAmounts(e.target.value, Field.OUTPUT)}
											/>
											{/* <Skeleton.Input
									className={
										!isLoadingTrade
											? "!hidden"
											: ""
									}
									active
									size="small"
								/> */}
										</div>
										<div
											className="flex justify-between items-center bg-[#1D1C21] py-[7px] px-3 cursor-pointer shadow-[0_2px_12px_0px_rgba(11,14,25,0.12)] w-[153px]"
											onClick={() => {
												setTypeModal(2);
												setIsShowTokenModal(true);
											}}
										>
											<div className="flex items-center gap-2">
												<img
													src={getTokenIcon(tokens[Field.OUTPUT] ?? "")}
													alt=""
													className="h-5 w-5"
												/>
												<span className="text-sm font-medium">{getSymbol(tokens[Field.OUTPUT] ?? "")}</span>
											</div>
											<ArrowDown />
										</div>
									</div>
									<div className="flex items-center gap-1 text-sm font-medium text-[rgba(255,255,255,0.50)]">
										{/* <span>
								{!!trade
									? `~
									${trade?.outputAmount.toSignificant(2)}`
									: "--"}
							</span> */}
										--
									</div>
								</div>
							</div>
						</div>
					</AutoColumn>
				</Wrapper>
			</AppBody>
			{isShowTokenModal && (
				<SelectTokenModal
					isShowing={isShowTokenModal}
					hide={setIsShowTokenModal}
					token0={tokens[Field.INPUT]}
					token1={tokens[Field.OUTPUT]}
					setToken={setTokens}
					typeModal={typeModal}
					balances={balances}
				/>
			)}
		</>
	);
}
