import styled, { css } from "styled-components";
// import { ButtonSecondary } from "./Button";
import { ConnectModal, useAccounts, useCurrentAccount, useDisconnectWallet, useSwitchAccount } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui.js/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "./Common/Button";
import { twMerge } from "tailwind-merge";

import DisconnectSVG from "/images/ic_disconnect.svg";

// const Web3StatusGeneric = styled(ButtonSecondary)`
// 	${({ theme }) => theme.flexRowNoWrap}
// 	width: 100%;
// 	align-items: center;
// 	padding: 18px 24px;
// 	border-radius: 8px;
// 	cursor: pointer;
// 	user-select: none;
// 	:focus {
// 		outline: none;
// 	}
// `;

// const Web3StatusConnect = styled(Web3StatusGeneric)<{
// 	faded?: boolean;
// 	pending?: boolean;
// }>`
// 	background-color: transparent;
// 	border: none;
// 	color: ${({ theme }) => theme.text1};
// 	font-weight: 500;

// 	a {
// 		color: ${({ theme }) => theme.text1};
// 	}

// 	:hover,
// 	:focus {
// 		color: ${({ theme }) => theme.text1};
// 	}

// 	${({ faded }) => faded && css``}
// `;

const Text = styled.p`
	font-family: Montserrat;
	flex: 1 1 auto;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin: 0 0.5rem 0 0.6rem;
	font-size: 16px;
	width: fit-content;
	font-weight: 500;
	color: ${({ theme }) => theme.text1};
`;

function ConnectedButton() {
	const accounts = useAccounts();
	const currentAccount = useCurrentAccount();
	const { mutateAsync: switchAccount } = useSwitchAccount();
	const { mutateAsync: disconnect } = useDisconnectWallet();
	const [open, setOpen] = useState(false);
	console.log(accounts);
	return (
		<>
			<label
				className="btn bg-transparent border-none hover:bg-transparent cursor-pointer"
				// @ts-ignore
				// onClick={() => setOpen(true)}
				onClick={() => document.getElementById("my_modal_2").showModal()}
			>
				<Text>{currentAccount ? formatAddress(currentAccount.address) : "..."}</Text>
				<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-white" />
			</label>
			<dialog
				id="my_modal_2"
				className={twMerge("modal")}
			>
				<div className="modal-box modal-bottom sm:modal-middle !rounded-md px-4 text-white">
					<form method="dialog">
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
					</form>
					<h3 className="font-bold text-lg">Account</h3>
					<div className="flex flex-col mt-4 gap-6">
						<div className="flex flex-col gap-1">
							{accounts.map((account, idx) => (
								<div
									key={idx}
									className="cursor-pointer flex justify-between items-center gap-1 self-stretch"
									onSelect={() => {
										switchAccount({ account });
									}}
								>
									{formatAddress(account.address)}
									<Check className={twMerge("mr-2 h-4 w-4", currentAccount?.address === account.address ? "opacity-100" : "opacity-0")} />
								</div>
							))}
						</div>
						<div
							className="flex justify-end gap-1 self-stretch cursor-pointer"
							onClick={() => {
								disconnect();
							}}
						>
							<div className="flex items-center gap-1">Disconnect</div>
							<img
								src={DisconnectSVG}
								alt=""
								className="w-6 h-6"
							/>
						</div>
					</div>
				</div>
			</dialog>
		</>
	);
}

export default function Login() {
	const [connectModalOpen, setConnectModalOpen] = useState(false);
	const currentAccount = useCurrentAccount();

	return (
		<>
			<>
				{currentAccount ? (
					<ConnectedButton />
				) : (
					<Button
						className="bg-[rgba(119,48,48,1)] text-white hover:bg-[rgba(119,48,48,1)]"
						onClick={() => setConnectModalOpen(true)}
					>
						Connect Wallet
					</Button>
				)}

				<ConnectModal
					trigger={<></>}
					open={connectModalOpen}
					onOpenChange={(open) => setConnectModalOpen(open)}
				/>
			</>
		</>
	);
}
