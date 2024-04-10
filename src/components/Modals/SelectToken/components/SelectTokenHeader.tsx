import CloseIcon from "../../../Icons/CloseIcon";

export const SelectTokenModalHeader = ({ close }: { close: any }) => {
	return (
		<div className="flex w-full flex-col gap-3">
			<div className="flex items-start justify-between self-stretch">
				<span className="text-2xl font-['Russo_One']">Select Asset</span>
				<div className="flex items-center w-6 h-6 cursor-pointer">
					<div onClick={close}>
						<CloseIcon />
					</div>
				</div>
			</div>
		</div>
	);
};
