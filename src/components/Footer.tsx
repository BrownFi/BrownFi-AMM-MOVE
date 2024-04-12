import styled from "styled-components";

import SocialRow from "./Social";

import Logo from "/images/logo-footer.png";
const FooterWrapper = styled.footer`
	display: flex;
	justify-content: space-between;
	padding: 16px;
	width: 100%;
	position: fixed;
	bottom: 0;
	height: 170px;
	background: rgba(14, 13, 16, 1);
	padding: 16px;
	@media (min-width: 768px) {
		padding: 40px 108px 40px 108px;
	}
	z-index: 21;
`;

const FooterText = styled.div`
	color: ${({ theme }) => theme.text2};
	font-size: 12px;
	font-weight: 500;
	font-family: "Montserrat";
	margin-top: 10px;
`;

const Footer = () => {
	return (
		<FooterWrapper>
			<div className="flex flex-col justify-center items-center">
				<img
					src={Logo}
					alt={""}
				/>
				<FooterText>© 2024 BrownFi. All rights reserved.</FooterText>
			</div>
			<SocialRow />
		</FooterWrapper>
	);
};

export default Footer;
