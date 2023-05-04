import { useState } from "react";
import {
  VerticalStack,
  AlphaCard,
  Text,
  Box,
  Button,
  ButtonGroup,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function ProductsCard() {
  const emptyToastProps = { content: "", error: false };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState<{
    content: string;
    error?: boolean;
  }>(emptyToastProps);
  const fetch = useAuthenticatedFetch();

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/create");

    if (response.ok) {
      await refetchProductCount();
      setToastProps({ content: "2 products created!" });
    } else {
      setIsLoading(false);
      setToastProps({
        content: "There was an error creating products",
        error: true,
      });
    }
  };

  return (
    <>
      {toastMarkup}
      <AlphaCard>
        <VerticalStack gap="5">
          <Text as="h2" variant="headingLg">
            Product Counter
          </Text>
          <Text as="p">
            Sample products are created with a default title and price. You can
            remove them at any time.
          </Text>
          <Text as="h4">
            TOTAL PRODUCTS
            <Box>
              <Text as="span" fontWeight="bold" variant="headingXl">
                {isLoadingCount ? "-" : (data as { count: number }).count}
              </Text>
            </Box>
          </Text>
          <ButtonGroup>
            <Button onClick={handlePopulate} loading={isLoading}>
              Populate 2 products
            </Button>
          </ButtonGroup>
        </VerticalStack>
      </AlphaCard>
    </>
  );
}
