import { colors, theme } from "../theme";
import { AutoColumn } from "./Column";
import { suiClient } from "../utils/config";
import { Field } from "../model/inputs";
import { SUILPLIST, SUITOKENS } from "../utils/tokens";
import { SUI_COIN_TYPE } from "../constants/constants";
import { checkLPValid, getBalanceAmount, getDecimalAmount, getSymbol, getTokenIcon } from "../utils/utils";
import { BigNumberInstance } from "../utils/bigNumber";
import { handleGetCoinAmount } from "../libs/handleGetCoinAmount";
import { useEffect, useState } from "react";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { twMerge } from "tailwind-merge";
import useSWR from "swr";
import { Input, Skeleton } from "antd";
import { useCurrentAccount, useSignTransactionBlock } from "@mysten/dapp-kit";
import { css, styled } from "styled-components";
import { isObject } from "lodash";
import SelectTokenModal from "./Modals/SelectToken/SelectTokenModal";
import ArrowDown from "./Icons/ArrowDown";
import SwapIcon from "./Icons/SwapIcon";
import AppBody from "../AppBody";
import SwapHeader from "./SwapHeader";
import Login from "./Login";
import ConfirmModal from "./Modals/TransactionLoading/TransactionLoading";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { fromHEX } from "@mysten/sui.js/utils";

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

export default function Swap() {
	const currentAccount = useCurrentAccount();
	const { mutate: signTransactionBlock } = useSignTransactionBlock();

	const [isShowTokenModal, setIsShowTokenModal] = useState<boolean>(false);
	const [isShowConfirmModal, setIsShowConfirmModal] = useState<boolean>(false);
	const [typeModal, setTypeModal] = useState<number>(1);

	const [tokens, setTokens] = useState<{
		[key in Field]: string;
	}>({
		[Field.INPUT]: SUI_COIN_TYPE,
		[Field.OUTPUT]: SUITOKENS[0].address,
	});

	const [tokenAmounts, setTokenAmounts] = useState<{ [key in Field]: string }>({
		[Field.INPUT]: "",
		[Field.OUTPUT]: "",
	});

	const [typedValue, setTypedValue] = useState("");
	const [independentField, setIndependentField] = useState<Field>(Field.INPUT);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [slippage, setSlippage] = useState<string>("0.5");
	const [disabledMultihops, setDisabledMultihops] = useState<boolean>(false);

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

	const handleSwap = async () => {
		try {
			const isLPExist = SUILPLIST.find((item) => item.coinA.address === tokens[Field.INPUT] && item.coinB.address === tokens[Field.OUTPUT]);

			if (!currentAccount || !balances) return;

			setIsShowConfirmModal(true);
			setSubmitting(true);

			const coinAType = tokens[Field.INPUT];
			const coinBType = tokens[Field.OUTPUT];

			let txb = new TransactionBlock();

			console.log(BigNumberInstance(tokenAmounts[Field.INPUT]) > getBalanceAmount(balances[0]));

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
				target: `0x6394e554433ff20acb0d79d9538a13f6f8159f2cb7444ed98ef2bbb2ec999c62::interface::swap`,
				typeArguments: [coinAType, coinBType],
				arguments: [
					txb.object("0x2b3ec8419b09ba06adaca2e704160903868145e47bcfa7dfa741f9b52207f006"),
					isObject(coinObjectAId) ? coinObjectAId : tx.object(coinObjectAId),
					txb.pure(1),
				],
			});
			txb.setSender(currentAccount.address);
			txb.setGasBudget(1000000000);

			const bytes = await txb.build({ client: suiClient });

			let res = signTransactionBlock(
				{
					transactionBlock: txb,
					chain: "sui:devnet",
				},
				{
					onSuccess: async (result) => {
						console.log("executed transaction block", result, result.signature);
						let data = await suiClient.executeTransactionBlock({
							transactionBlock: bytes,
							signature: result.signature,
						});
						setSubmitting(false);
						setIsSuccess(true);
						setTokenAmounts({
							[Field.INPUT]: "",
							[Field.OUTPUT]: "",
						});
					},
				}
			);
		} catch (error) {
			console.log("🚀 ~ file: add-lp.js:6 ~ main ~ error:", error);
		}
	};

	const swap = async () => {
		try {
			const keypair = Ed25519Keypair.fromSecretKey(fromHEX("b89dd1d83371e777f543e336c04450d5c8f94b9d3dac6ce6cea85af3d12cc3c2"));

			console.log("🚀 ~ file: add-lp.ts:27 ~ main ~ keypair:", keypair.getPublicKey().toSuiAddress());

			const coinAType = "0x2::sui::SUI";
			// const coinAType =
			// 	"0x571ae7fc8e3b557f4297e20fedcfd8319c8ab46c3a777a143622900a79b02164::coins::USDT";
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

			const rest = txb.moveCall({
				target: `0x6394e554433ff20acb0d79d9538a13f6f8159f2cb7444ed98ef2bbb2ec999c62::interface::swap`,
				typeArguments: [coinAType, coinBType],
				arguments: [
					txb.object("0x2b3ec8419b09ba06adaca2e704160903868145e47bcfa7dfa741f9b52207f006"),
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

	const handleChangeAmounts = (value: string, independentField: Field) => {
		if (isNaN(+value)) return;

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
				<SwapHeader />
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
								// onClick={() => handleSwap()}
								onClick={handleSwap}
							>
								<span className="text-base font-bold">Swap</span>
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
					submitting={submitting}
					isSuccess={isSuccess}
					setIsSuccess={setIsSuccess}
					setSubmitting={setSubmitting}
				/>
			)}
		</>
	);
}
