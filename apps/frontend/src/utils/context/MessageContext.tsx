import { createContext, useState } from "react";

type MessageProviderType = {
	children: React.ReactNode;
};

type MessageContextType = {
	message: string;
	showDialog: boolean;
	handleMessageToggle: (m: string) => void;
	closeDialog: () => void;
};
export const MessageContext = createContext<MessageContextType>({
	message: "",
	showDialog: false,
	handleMessageToggle: () => {},
	closeDialog: () => {},
});

export const MessageProvider = ({ children }: MessageProviderType) => {
	const [message, setMessage] = useState<string>("");
	const [showDialog, setShowDialog] = useState<boolean>(false);
	const handleMessageToggle = (message: string) => {
		setMessage(message);
		setShowDialog(true);
	};
	const closeDialog = () => {
		setMessage("");
		setShowDialog(false);
	};
	return (
		<MessageContext.Provider
			value={{
				message,
				showDialog,
				handleMessageToggle,
				closeDialog,
			}}
		>
			{children}
		</MessageContext.Provider>
	);
};
