import styled from "styled-components";
import { ButtonLight } from "./Button";
import { AutoColumn } from "./Column";
import ConnectWallet from "/images/connect-wallet.png";

const PageWrapper = styled(AutoColumn)`
	width: 100%;
`;

export default function CreatePair() {
	return (
		<>
			<PageWrapper>
				<AutoColumn
					gap="lg"
					justify="center"
				>
					<AutoColumn
						gap="md"
						style={{ width: "100%", justifyContent: "center" }}
					>
						<div className="flex w-full justify-center">
							<ButtonLight
								maxWidth={"436px"}
								// onClick={() => login()}
							>
								<img src={ConnectWallet} /> &nbsp; Connect Wallet
							</ButtonLight>
						</div>
					</AutoColumn>
				</AutoColumn>
			</PageWrapper>
		</>
	);
}
