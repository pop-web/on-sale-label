import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { PropsWithChildren } from "react";

/**
 * Sets up the QueryClientProvider from react-query.
 * @desc See: https://react-query.tanstack.com/reference/QueryClientProvider#_top
 */
export const QueryProvider = ({ children }: PropsWithChildren) => {
  const client = new QueryClient({
    queryCache: new QueryCache(),
    mutationCache: new MutationCache(),
  });

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
