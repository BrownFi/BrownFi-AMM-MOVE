import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnMount: false,
			refetchInterval: false,
			refetchOnWindowFocus: false,
			refetchIntervalInBackground: false,
		},
	},
});
