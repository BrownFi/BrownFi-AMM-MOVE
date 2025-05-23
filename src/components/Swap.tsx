import { colors, theme } from "../theme";
import { AutoColumn } from "./Column";
import { suiClient } from "../utils/config";
import { Field } from "../model/inputs";
import {
	AMM_PACKAGE,
	SUI_USDT_POOL_ID,
	SUILPLIST,
	SUITOKENS,
} from "../utils/tokens";
import { SUI_COIN_TYPE } from "../constants/constants";
import {
	checkLPValid,
	getBalanceAmount,
	getDecimalAmount,
	getSymbol,
	getTokenIcon,
} from "../utils/utils";
import { BigNumberInstance } from "../utils/bigNumber";
import {
	handleGetCoinAmount,
	normalizeCoinType,
} from "../libs/handleGetCoinAmount";
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
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { numberWithCommas } from "../utils/format";

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
	const [status, setStatus] = useState<string>("");
	const [slippage, setSlippage] = useState<string>("0.5");
	const [disabledMultihops, setDisabledMultihops] = useState<boolean>(false);

	const { data: balances, isLoading } = useSWR<(any | undefined)[]>(
		[currentAccount, tokens[Field.INPUT], tokens[Field.OUTPUT]],
		async () => {
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
		}
	);

	const [pool, setPool] = useState<any>();

	useEffect(() => {
		(async () => {
			// const tableId =
			// 	"0x623c337b52df29f90d427a4cb5c38979fea3cbbd4b05ca16b596014daf2762cc";

			// const tableKeys = await suiClient.getDynamicFields({ parentId: tableId });
			// const poolItem = tableKeys.data.find(
			// 	(i) =>
			// 		(normalizeCoinType((i.name.value as any).a.name) ===
			// 			normalizeCoinType(tokens[Field.INPUT]) &&
			// 			normalizeCoinType((i.name.value as any).b.name) ===
			// 				normalizeCoinType(tokens[Field.OUTPUT])) ||
			// 		(normalizeCoinType((i.name.value as any).a.name) ===
			// 			normalizeCoinType(tokens[Field.OUTPUT]) &&
			// 			normalizeCoinType((i.name.value as any).b.name) ===
			// 				normalizeCoinType(tokens[Field.INPUT]))
			// );
			// if (!poolItem) return;

			// const poolId = await suiClient.getDynamicFieldObject({
			// 	parentId: FACTORY_TABLE_ID,
			// 	name: {
			// 		type: poolItem.name.type,
			// 		fields: {
			// 			a: {
			// 				type: "0x1::type_name::TypeName",
			// 				fields: {
			// 					name: (poolItem.name.value as any).a.name,
			// 				},
			// 			},
			// 			b: {
			// 				type: "0x1::type_name::TypeName",
			// 				fields: {
			// 					name: (poolItem.name.value as any).b.name,
			// 				},
			// 			},
			// 		},
			// 	},
			// });

			// @todo fetch pool ID

			const pool = await suiClient.getObject({
				id: SUI_USDT_POOL_ID,
				options: { showType: true, showContent: true },
			});
			const types = pool.data!.type!.match(/<([^,]+),\s*([^>]+)>/);

			setPool({
				id: pool.data!.objectId,
				token0: types![1],
				token1: types![2],
				reserve0: (pool.data!.content! as any).fields.balance_a,
				reserve1: (pool.data!.content! as any).fields.balance_b,
				fee: (pool.data!.content! as any).fields.fee_points,
				lp: (pool.data!.content! as any).fields.lp_supply.fields.value,
			});
		})();
	}, [suiClient, tokens[Field.INPUT], tokens[Field.OUTPUT]]);

	const handleSwap = async () => {
		try {
			// const isLPExist = SUILPLIST.find((item) => item.coinA.address === tokens[Field.INPUT] && item.coinB.address === tokens[Field.OUTPUT]);

			if (!pool || !currentAccount || !balances) return;

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

			const inputIsToken0 =
				normalizeCoinType(pool.token0) ===
				normalizeCoinType(tokens[Field.INPUT]);

			if (inputIsToken0) {
				txb.moveCall({
					target: `${AMM_PACKAGE}::swap::swap_a_for_b_with_coin_and_transfer_to_sender`,
					typeArguments: [coinAType, coinBType],
					arguments: [
						txb.object(pool.id),
						isObject(coinObjectAId) ? coinObjectAId : tx.object(coinObjectAId),
						txb.pure(0, "u64"),
					],
				});
			} else {
				txb.moveCall({
					target: `${AMM_PACKAGE}::swap::swap_b_for_a_with_coin_and_transfer_to_sender`,
					typeArguments: [coinBType, coinAType],
					arguments: [
						txb.object(pool.id),
						isObject(coinObjectAId) ? coinObjectAId : tx.object(coinObjectAId),
						txb.pure(0, "u64"),
					],
				});
			}

			txb.setSender(currentAccount.address);
			txb.setGasBudget(10000000);

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
			console.log("🚀 ~ file: swap.js:6 ~ main ~ error:", error);
		}
	};
	const handleChangeAmounts = (value: string, independentField: Field) => {
		if (isNaN(+value)) return;

		setTypedValue(value);
		setIndependentField(independentField);

		if (pool) {
			const isToken0 =
				normalizeCoinType(pool.token0) ===
				normalizeCoinType(tokens[independentField]);

			let otherValue = (
				isToken0
					? (+value * pool.reserve1) / pool.reserve0
					: (+value * pool.reserve0) / pool.reserve1
			).toString();

			console.log(pool);

			if (independentField === Field.INPUT) {
				setTokenAmounts({
					[Field.INPUT]: value,
					[Field.OUTPUT]: otherValue,
				});
			} else {
				setTokenAmounts({
					[Field.INPUT]: otherValue,
					[Field.OUTPUT]: value,
				});
			}
		} else {
			if (independentField === Field.INPUT) {
				setTokenAmounts((pre) => ({
					[Field.INPUT]: value,
					[Field.OUTPUT]: pre.OUTPUT,
				}));
			} else {
				setTokenAmounts((pre) => ({
					[Field.INPUT]: pre.INPUT,
					[Field.OUTPUT]: value,
				}));
			}
		}
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
									<span className="text-lg font-normal text-white font-['Russo_One']">
										You Pay
									</span>
									<div className="flex items-center gap-1 text-base font-normal">
										<span>Balance:</span>
										<span>
											{balances && balances.length > 0
												? `${numberWithCommas(getBalanceAmount(balances[0]))}`
												: "--"}
										</span>
									</div>
								</div>
								<div className="flex flex-col items-start gap-[2px] self-stretch">
									<div className="flex justify-between items-center self-stretch">
										<div className="flex justify-between items-center self-stretch">
											<Input
												placeholder="0.0"
												className="border-none px-0 text-xl font-bold max-w-[150px] text-[#C6C6C6]"
												value={tokenAmounts[Field.INPUT]}
												onChange={(e) =>
													handleChangeAmounts(e.target.value, Field.INPUT)
												}
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
												<span className="text-sm font-medium">
													{getSymbol(tokens[Field.INPUT] ?? "")}
												</span>
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
									<span className="text-lg font-normal text-white font-['Russo_One']">
										Your Receive
									</span>
									<div className="flex items-center gap-1 text-base font-normal">
										<span>Balance:</span>
										<span className={isLoading ? "hidden" : ""}>
											{balances && balances.length > 0
												? `${numberWithCommas(getBalanceAmount(balances[1]))}`
												: "--"}
										</span>
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
												onChange={(e) =>
													handleChangeAmounts(e.target.value, Field.OUTPUT)
												}
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
												<span className="text-sm font-medium">
													{getSymbol(tokens[Field.OUTPUT] ?? "")}
												</span>
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
						{currentAccount &&
						balances &&
						BigNumberInstance(tokenAmounts[Field.INPUT]) >
							getBalanceAmount(balances[0]) ? (
							<div className="flex justify-center items-center gap-2 self-stretch py-[18px] px-6 bg-[#737373] cursor-not-allowed">
								<span className="text-base font-bold">
									Insufficient Balance
								</span>
							</div>
						) : (
							<div
								className={twMerge(
									"flex justify-center items-center gap-2 self-stretch py-[18px] px-6 bg-[#773030] cursor-pointer",
									!currentAccount && "hidden"
								)}
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
					status={status}
					setStatus={setStatus}
					isSwap={true}
				/>
			)}
		</>
	);
}
