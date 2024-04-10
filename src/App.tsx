// import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import styled from "styled-components";
import BannerImg from "/images/background-1.png";
import BannerImg2 from "/images/background-2.png";
import Pool from "./components/Pool";
import Swap from "./components/Swap";
import AddLiquidity from "./components/AddLiquidity";

const AppWrapper = styled.div<{ isHomePage: boolean }>`
	display: flex;
	flex-flow: column;
	align-items: flex-start;
	min-height: 100vh;
	background: ${() => `url(${BannerImg}) right top no-repeat`};
	background-color: ${({ theme }) => theme.primary1};
	background-size: inherit;
`;

const BodyWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: center;
	flex: 1;
	z-index: 1;
	height: 100vh;
	justify-content: center;
	margin-bottom: 130px;

	${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 6rem;
  `};
`;

const HeaderWrapper = styled.div`
	${({ theme }) => theme.flexRowNoWrap}
	width: 100%;
	justify-content: space-between;
	position: fixed;
	top: 0;
	z-index: 2;
`;

function App() {
	return (
		<>
			<AppWrapper isHomePage={location.pathname === "/"}>
				<img
					src={BannerImg2}
					alt=""
					style={{ position: "absolute", bottom: 150, width: "100%" }}
				/>
				<HeaderWrapper>
					<Header />
				</HeaderWrapper>
				<BodyWrapper>
					<Routes>
						<Route
							path="/"
							element={<Pool />}
						/>
						<Route
							path="/swap"
							element={<Swap />}
						/>
						<Route
							path="/pool"
							element={<Pool />}
						/>
						<Route
							path="/add/v2"
							element={<AddLiquidity />}
						/>
					</Routes>
				</BodyWrapper>
			</AppWrapper>
			<Footer />
		</>
	);
}

export default App;
