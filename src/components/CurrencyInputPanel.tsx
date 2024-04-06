import { styled } from "styled-components";

const InputPanel = styled.div<{ hideInput?: boolean }>`
	${({ theme }) => theme.flexColumnNoWrap}
	position: relative;
	background-color: ${({ theme, hideInput }) => (hideInput ? theme.primary1 : theme.primary1)};
	z-index: 1;
	width: ${({ hideInput }) => (hideInput ? "100%" : "initial")};
	padding: 16px 20px;
`;

export default function CurrencyInputPanel() {
	return <InputPanel hideInput></InputPanel>;
}
