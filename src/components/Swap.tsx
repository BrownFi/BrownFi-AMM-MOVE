import { css, styled } from "styled-components";
import { colors, theme } from "../theme";
import AppBody from "../AppBody";
import SwapHeader from "./SwapHeader";
import Row, { RowFixed } from "./Row";
import { AutoColumn } from "./Column";
import CurrencyInputPanel from "./CurrencyInputPanel";

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
	return (
		<>
			<AppBody>
				<SwapHeader />
				<Wrapper id="swap-page">
					<AutoColumn gap={"md"}>
						<CurrencyInputPanel />
						<ArrowWrapper clickable></ArrowWrapper>
						<CurrencyInputPanel />
					</AutoColumn>
				</Wrapper>
			</AppBody>
		</>
	);
}
