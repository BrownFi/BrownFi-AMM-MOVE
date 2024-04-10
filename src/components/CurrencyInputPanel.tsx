import { Input } from "antd";
import { styled } from "styled-components";
import ArrowDown from "./Icons/ArrowDown";
import { Field } from "../model/inputs";

const InputPanel = styled.div<{ hideInput?: boolean }>`
	${({ theme }) => theme.flexColumnNoWrap}
	position: relative;
	background-color: ${({ theme, hideInput }) => (hideInput ? theme.primary1 : theme.primary1)};
	z-index: 1;
	width: ${({ hideInput }) => (hideInput ? "100%" : "initial")};
	padding: 16px 20px;
	gap: 20px;
`;

const InputWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
`;

export default function CurrencyInputPanel(props: any) {
	console.log(props.balances);
	return (
		<InputPanel hideInput>
			<InputWrapper>
				<span className="text-[18px] text-white">You Pay</span>
				<span className="text-base font-medium">Balance: 0.1</span>
			</InputWrapper>
			<div className="flex flex-col items-start gap-[2px] self-stretch">
				<div className="flex justify-between items-center self-stretch">
					<div className="flex justify-between items-center self-stretch">
						<Input
							placeholder="0.0"
							className="border-none px-0 text-xl font-bold max-w-[150px] text-[#C6C6C6]"
							value={props.independentField === Field.INPUT ? props.typedValue : ""}
							onChange={(e) => props.handleChangeAmounts(e.target.value, Field.INPUT)}
						/>
					</div>
					<div
						className="flex justify-between items-center bg-[#1D1C21] py-[7px] px-3 cursor-pointer shadow-[0_2px_12px_0px_rgba(11,14,25,0.12)] w-[153px]"
						// onClick={() => {
						// 	setTypeModal(1);
						// 	setIsShowTokenModal(true);
						// }}
					>
						<div className="flex items-center gap-2">
							{/* <img
										src={getTokenIcon(
											tokens[Field.INPUT]?.address
										)}
										alt=""
										className="h-5 w-5"
									/> */}
							<span className="text-sm font-medium">{/* {tokens[Field.INPUT]?.symbol} */}--</span>
						</div>
						<ArrowDown />
					</div>
				</div>
				<div className="flex items-center gap-1 text-sm font-medium text-[rgba(255,255,255,0.50)]">
					<span>
						{/* {!!trade
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
									: "--"} */}
						--
					</span>
				</div>
			</div>
		</InputPanel>
	);
}
