import styled, { css } from "styled-components";
import { ButtonSecondary } from "./Button";
import ConnectWallet from "/images/connect-wallet.png";
import { ConnectModal, useAccounts, useCurrentAccount, useDisconnectWallet, useSwitchAccount } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui.js/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./Common/popover";
import { Button } from "./Common/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./Common/command";
import { twMerge } from "tailwind-merge";

const Web3StatusGeneric = styled(ButtonSecondary)`
	${({ theme }) => theme.flexRowNoWrap}
	width: 100%;
	align-items: center;
	padding: 18px 24px;
	border-radius: 8px;
	cursor: pointer;
	user-select: none;
	:focus {
		outline: none;
	}
`;

const Web3StatusConnect = styled(Web3StatusGeneric)<{
	faded?: boolean;
	pending?: boolean;
}>`
	background-color: transparent;
	border: none;
	color: ${({ theme }) => theme.text1};
	font-weight: 500;

	a {
		color: ${({ theme }) => theme.text1};
	}

	:hover,
	:focus {
		color: ${({ theme }) => theme.text1};
	}

	${({ faded }) => faded && css``}
`;

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

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[180px] justify-between"
				>
					{currentAccount ? formatAddress(currentAccount.address) : "..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[180px] p-0">
				<Command>
					<CommandInput placeholder="Search accounts..." />
					<CommandEmpty>No account found.</CommandEmpty>
					<CommandGroup>
						{accounts.map((account) => (
							<CommandItem
								key={account.address}
								value={account.address}
								className="cursor-pointer"
								onSelect={() => {
									switchAccount({ account });
									setOpen(false);
								}}
							>
								<Check className={twMerge("mr-2 h-4 w-4", currentAccount?.address === account.address ? "opacity-100" : "opacity-0")} />
								{formatAddress(account.address)}
							</CommandItem>
						))}

						<CommandItem
							className="cursor-pointer"
							onSelect={() => {
								disconnect();
							}}
						>
							Disconnect
						</CommandItem>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export default function Login() {
	const [connectModalOpen, setConnectModalOpen] = useState(false);
	const currentAccount = useCurrentAccount();
	return (
		<>
			<>
				{currentAccount ? <ConnectedButton /> : <Button onClick={() => setConnectModalOpen(true)}>Connect Wallet</Button>}

				<ConnectModal
					trigger={<></>}
					open={connectModalOpen}
					onOpenChange={(open) => setConnectModalOpen(open)}
				/>
			</>
		</>
	);
}
