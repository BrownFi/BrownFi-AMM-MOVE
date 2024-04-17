import { css, styled } from "styled-components";
import { colors } from "../theme";
import AppBody from "../AppBody";
import { AutoColumn } from "./Column";
import { useCurrentAccount, useSignTransactionBlock, useWallets } from "@mysten/dapp-kit";
import { suiClient } from "../utils/config";
import { useState } from "react";
import { Field } from "../model/inputs";
import { SUILPLIST, SUITOKENS } from "../utils/tokens";
import { SUI_COIN_TYPE } from "../constants/constants";
import useSWR from "swr";
import { Input, Skeleton, Slider } from "antd";
import ArrowDown from "./Icons/ArrowDown";
import SwapIcon from "./Icons/SwapIcon";
import { twMerge } from "tailwind-merge";
import { checkLPValid, getBalanceAmount, getDecimalAmount, getSymbol, getTokenIcon } from "../utils/utils";
import SelectTokenModal from "./Modals/SelectToken/SelectTokenModal";
import ArrowBack from "./Icons/ArrowBack";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { handleGetCoinAmount } from "../libs/handleGetCoinAmount";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { fromHEX } from "@mysten/sui.js/utils";
import { isObject } from "lodash";
import HelpIcon from "./Icons/HelpIcon";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { BigNumberInstance } from "../utils/bigNumber";
import Login from "./Login";
import ConfirmModal from "./Modals/TransactionLoading/TransactionLoading";

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
	const wallets = useWallets();
	const { mutate: signTransactionBlock } = useSignTransactionBlock();
	const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();

	const [isShowTokenModal, setIsShowTokenModal] = useState<boolean>(false);
	const [typeModal, setTypeModal] = useState<number>(1);
	const [isShowConfirmModal, setIsShowConfirmModal] = useState<boolean>(false);
	const [disabled, setDisabled] = useState(false);
	const [k, setK] = useState(2);
	const [status, setStatus] = useState<string>("");
	const [typedValue, setTypedValue] = useState("");
	const [independentField, setIndependentField] = useState<Field>(Field.INPUT);
	const [digest, setDigest] = useState<string>("");

	const [tokens, setTokens] = useState<{
		[key in Field]: string;
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

	const { data: balances, isLoading } = useSWR<any[]>([currentAccount, tokens[Field.INPUT], tokens[Field.OUTPUT]], async () => {
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

	const addLiquidity = async () => {
		try {
			const isLPExist = SUILPLIST.find((item) => item.coinA.address === tokens[Field.INPUT] && item.coinB.address === tokens[Field.OUTPUT]);

			if (!isLPExist || !currentAccount || !balances) return;

			setIsShowConfirmModal(true);
			setStatus("submitting");
			const coinAType = tokens[Field.INPUT];
			const coinBType = tokens[Field.OUTPUT];

			let txb = new TransactionBlock();

			const { coin: coinObjectAId, tx } = await handleGetCoinAmount(
				getDecimalAmount(tokenAmounts[Field.INPUT], tokens[Field.INPUT]),
				currentAccount.address,
				coinAType,
				txb
			);
			const { coin: coinObjectBId, tx: tx2 } = await handleGetCoinAmount(
				getDecimalAmount(tokenAmounts[Field.OUTPUT], tokens[Field.OUTPUT]),
				currentAccount.address,
				coinBType,
				txb
			);

			txb.moveCall({
				target: `0xbacddd9ff142a3d5621fc0bb453d7af967b1dc201ce982b32b6db9402370fbd0::interface::add_liquidity`,
				typeArguments: [coinAType, coinBType],
				arguments: [
					txb.object("0x6e7e70fe7c052cb9a8c66015ecb07ab3de2ad4500e7031c0ae135a2917948bb9"),
					isObject(coinObjectAId) ? coinObjectAId : tx.object(coinObjectAId),
					txb.pure(1),
					isObject(coinObjectBId) ? coinObjectBId : tx.object(coinObjectBId),
					txb.pure(1),
				],
			});
			txb.setSender(currentAccount.address);
			txb.setGasBudget(1000000000);

			const bytes = await txb.build({ client: suiClient });

			let res = signTransactionBlock(
				{
					transactionBlock: txb,
					chain: "sui:testnet",
				},
				{
					onSuccess: async (result) => {
						let data = await suiClient.executeTransactionBlock({
							transactionBlock: bytes,
							signature: result.signature,
						});
						setDigest(data.digest);
						setStatus("success");
						setTokenAmounts({
							[Field.INPUT]: "",
							[Field.OUTPUT]: "",
						});
					},
					onError: async (err) => {
						console.log(err);
						setStatus("fail");
					},
				}
			);
		} catch (error) {
			console.log("🚀 ~ file: add-lp.js:6 ~ main ~ error:", error);
			setIsShowConfirmModal(false);
		}
	};

	const handleChangeAmounts = (value: string, independentField: Field) => {
		if (isNaN(+value)) return;

		// if (value === "") {
		// 	setTokenAmounts({
		// 		[Field.INPUT]: "",
		// 		[Field.OUTPUT]: "",
		// 	});
		// 	return;
		// }

		setTypedValue(value);
		setIndependentField(independentField);
		setTokenAmounts({
			[Field.INPUT]: value,
			[Field.OUTPUT]: (Number(value) * 9).toString(),
		});
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
												value={tokenAmounts[Field.INPUT]}
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
									<div className="flex items-center gap-1 text-sm font-medium text-[rgba(255,255,255,0.50)]">--</div>
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
												value={tokenAmounts[Field.OUTPUT]}
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
									<div className="flex items-center gap-1 text-sm font-medium text-[rgba(255,255,255,0.50)]">--</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col items-start gap-8 self-stretch">
							<div className="flex flex-col items-start gap-4 self-stretch">
								<div className="flex items-center gap-5 self-stretch">
									<div className="flex items-center gap-1">
										<span className="text-base font-bold leading-[20px]">Set Liquidity Concentration Parameter</span>
										<HelpIcon />
									</div>
								</div>
								<div className="flex items-center gap-2 self-stretch">
									<span className="text-base font-medium leading-[24px] whitespace-nowrap">0.8</span>
									<Slider
										className="w-full"
										defaultValue={k}
										tooltip={{ open: true }}
										max={2}
										min={0.8}
										step={0.1}
										tooltipPlacement="bottom"
										onChange={onChangeK}
										disabled={disabled}
									/>
									<span className="text-base font-medium leading-[24px]">2</span>
								</div>
							</div>
							<div className="flex justify-between items-center self-stretch">
								<span className="text-base font-bold leading-[20px]">Capital Efficiency</span>
								<div className="flex h-8 items-center justify-center gap-1 px-4 bg-[#323038]">
									<span className="text-xs font-bold">1000x</span>
								</div>
							</div>
						</div>
						{!currentAccount && <Login></Login>}
						{currentAccount && balances && BigNumberInstance(tokenAmounts[Field.INPUT]) > getBalanceAmount(balances[0]) ? (
							<div className="flex justify-center items-center gap-2 self-stretch py-[18px] px-6 bg-[#737373] cursor-not-allowed">
								<span className="text-base font-bold">Insufficient Balance</span>
							</div>
						) : (
							<div
								className={twMerge(
									"flex justify-center items-center gap-2 self-stretch py-[18px] px-6 bg-[#773030] cursor-pointer",
									!currentAccount && "hidden"
								)}
								onClick={addLiquidity}
							>
								<span className="text-base font-bold">Add</span>
							</div>
						)}
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
			{isShowConfirmModal && (
				<ConfirmModal
					isShowing={isShowConfirmModal}
					hide={setIsShowConfirmModal}
					status={status}
					setStatus={setStatus}
				/>
			)}
		</>
	);
}
