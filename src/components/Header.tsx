import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import Row, { RowFixed } from "./Row";
import Login from "./Login";

import Logo from "/images/logo.png";

const HeaderFrame = styled.div<{
	showBackground?: boolean;
	isHomePage?: boolean;
}>`
	display: flex;
	gap: 44px;
	height: 96px;
	justify-content: space-between;
	flex-direction: row;
	width: 100%;
	top: 0;
	position: relative;
	padding: 20px 44px;
	z-index: 21;
	position: relative;
	background: ${({ theme }) => theme.bg0};

	${({ theme }) => theme.mediaWidth.upToMedium`
    padding:  1rem;
    grid-template-columns: 275px 1fr;
  `};

	${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 1rem;
  `}
`;

const HeaderControls = styled.div`
	display: flex;
	gap: 15px;
	flex-direction: row;

	${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: end;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg0};
  `};
`;

const HeaderElement = styled.div`
	height: 56px;
	display: flex;
	align-items: center;

	font-family: Montserrat;
	background: ${({ theme }) => theme.red2};
	/* addresses safari's lack of support for "gap" */
	& > *:not(:first-child) {
		margin-left: 8px;
	}

	${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row-reverse;
    align-items: center;
  `};
`;

const HeaderRow = styled(RowFixed)`
	${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`;

const HeaderLinks = styled(Row)`
	border-radius: 10px;
	grid-auto-flow: column;
	gap: 1rem;
	overflow: auto;
	font-size: 20px;
	font-weight: 400;
	${({ theme }) => theme.mediaWidth.upToMedium`
    justify-self: flex-end;
  `};
	.ACTIVE {
		color: rgba(39, 227, 171, 1);
	}
`;

export const AccountElement = styled.div<{ active: boolean }>`
	display: flex;
	flex-direction: row;
	padding: 0px 20px;
	align-items: center;
	background: ${({ theme }) => theme.red2};
	border: none;
	white-space: nowrap;
	cursor: pointer;
	height: 100%;
	button {
		border: none;
		p {
			color: ${({ theme }) => theme.text1};
			font-family: Montserrat;
			font-size: 16px;
			font-weight: 500;
		}
		div {
			height: 30px !important;
			width: 30px !important;
		}
		:hover {
			background: ${({ theme }) => theme.red2};
			border: none;
			box-shadow: none;
		}
	}
`;

const HideSmall = styled.span`
	${({ theme }) => theme.mediaWidth.upToSmall` 
    display: none;
  `};
`;

const HeaderLeft = styled.span`
	display: flex;
	gap: 44px;
	align-items: center;
`;

const Title = styled(Link)`
	display: flex;
	align-items: center;
	pointer-events: auto;
	justify-self: flex-start;
	${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
	:hover {
		cursor: pointer;
	}
`;

const activeClassName = "ACTIVE";

const StyledNavLink = styled(NavLink).attrs({
	activeClassName,
})`
	${({ theme }) => theme.flexRowNoWrap}
	align-items: left;
	border-radius: 10px;
	outline: none;
	font-family: Russo One;
	cursor: pointer;
	text-decoration: none;
	color: ${({ theme }) => theme.text2};
	width: fit-content;
	font-weight: 400;
	font-size: 16px;
	padding: 8px 16px;

	&.${activeClassName} {
		border-radius: 0px;
		color: rgba(39, 227, 171, 1);
	}

	:hover,
	:focus {
		color: ${({ theme }) => theme.primary2};
	}
`;

export const StyledLink = styled.a.attrs({
	activeClassName,
})`
	${({ theme }) => theme.flexRowNoWrap}
	align-items: left;
	border-radius: 10px;
	outline: none;
	cursor: pointer;
	text-decoration: none;
	color: ${({ theme }) => theme.primary1};
	font-size: 1rem;
	width: fit-content;
	font-weight: 700;
	padding: 8px 12px;

	&.${activeClassName} {
		border-radius: 0px;
		color: ${({ theme }) => theme.primary1};
	}

	:hover, ;
`;

export const StyledMenuButton = styled.button`
	position: relative;
	width: 100%;
	height: 100%;
	border: none;
	background-color: transparent;
	margin: 0;
	padding: 0;
	height: 35px;
	background-color: ${({ theme }) => theme.bg0};
	margin-left: 8px;
	padding: 0.15rem 0.5rem;
	border-radius: 0.5rem;

	:hover,
	:focus {
		cursor: pointer;
		outline: none;
		border: ${({ theme }) => `1px solid ${theme.primary1}`};
	}

	svg {
		margin-top: 2px;
	}
	> * {
		stroke: ${({ theme }) => theme.primary1};
	}
`;

export default function Header() {
	const location = useLocation();

	return (
		<HeaderFrame
			showBackground
			isHomePage={location.pathname === "/"}
		>
			<HeaderLeft>
				<HeaderRow>
					<Title to="/">
						<img src={Logo} />
					</Title>
				</HeaderRow>
				<HideSmall>
					<HeaderLinks>
						<StyledNavLink
							id={`swap-nav-link`}
							to={"/swap"}
						>
							Swap
						</StyledNavLink>
						<StyledNavLink
							id={`pool-nav-link`}
							to={"/pool"}
							// isActive={(match, { pathname }) =>
							// 	Boolean(match) ||
							// 	pathname.startsWith("/add") ||
							// 	pathname.startsWith("/remove") ||
							// 	pathname.startsWith("/increase") ||
							// 	pathname.startsWith("/find")
							// }
						>
							Pools
						</StyledNavLink>
					</HeaderLinks>
				</HideSmall>
			</HeaderLeft>
			<HeaderControls>
				<HeaderElement>
					<Login />
				</HeaderElement>
			</HeaderControls>
		</HeaderFrame>
	);
}
