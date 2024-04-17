import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ConfirmModalHeader } from "./components/TransactionLoadingHeader";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import CheckCircle from "../../Icons/CheckedCircle";
import FailedCircle from "../../Icons/FailCircle";

const ConfirmModal = (props: any) => {
	const [isShowMore, setIsShowMore] = useState<boolean>(false);
	const { isShowing, hide, status, setStatus, isSwap } = props;

	const useOutsideAlerter = (ref: any) => {
		useEffect(() => {
			/**
			 * Alert if clicked on outside of element
			 */
			function handleClickOutside(event: any) {
				if (ref.current && !ref.current.contains(event.target)) {
					hide(false);
					setStatus("");
				}
			}
			// Bind the event listener
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				// Unbind the event listener on clean up
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, []);
	};

	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef);

	return (
		<div>
			{isShowing && (
				<div className={`modal-overlay`}>
					<div
						ref={wrapperRef}
						className={twMerge(
							"flex flex-col items-center gap-5 modal-content-review",
							status === "submitting" && "gap-10",
							status === "success" && "gap-10",
							status === "fail" && "gap-10"
						)}
					>
						<ConfirmModalHeader
							close={() => {
								hide(false);
								setStatus("");
							}}
						/>
						{status === "submitting" && (
							<>
								<div className="flex flex-col items-center gap-5">
									<Spin
										indicator={
											<LoadingOutlined
												style={{
													fontSize: 100,
													color: "rgba(39, 227, 171, 1)",
												}}
												spin
											/>
										}
									/>
								</div>
								<span className="text-xs text-[rgba(255,255,255,0.5)] font-medium leading-[18px]">Proceed in your wallet</span>
							</>
						)}
						{status === "success" && (
							<>
								<div className="flex flex-col items-center gap-5">
									<CheckCircle />
									<div className="flex flex-col items-center gap-5">
										<span className="text-[32px] text-[#27E39F] font-semibold leading-[39px]">{isSwap ? "Swap Success" : "Add Liquidity Success"}</span>
									</div>
								</div>
							</>
						)}
						{status === "fail" && (
							<>
								<div className="flex flex-col items-center gap-5">
									<FailedCircle />
									<div className="flex flex-col items-center gap-5">
										<span className="text-[32px] text-[#FF3B6A] font-semibold leading-[39px]">{isSwap ? "Swap Fail" : "Add Liquidity Fail"}</span>
									</div>
								</div>
								<span className="text-base text-[#FF3B6A] font-bold leading-[20px] cursor-pointer">View on Explorer</span>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default ConfirmModal;
