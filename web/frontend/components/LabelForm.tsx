import { useState, useCallback, FC } from "react";
import {
  Banner,
  AlphaCard,
  Form,
  FormLayout,
  TextField,
  Button,
  Thumbnail,
  Icon,
  Layout,
  Text,
  Box,
  ButtonGroup,
  VerticalStack,
  HorizontalStack,
} from "@shopify/polaris";
import {
  ContextualSaveBar,
  ResourcePicker,
  useAppBridge,
  useNavigate,
} from "@shopify/app-bridge-react";
import { ImageMajor, AlertMinor } from "@shopify/polaris-icons";

/* Import the useAuthenticatedFetch hook included in the Node app template */
import { useAuthenticatedFetch } from "../hooks";

/* Import custom hooks for forms */
import { useForm, useField, notEmptyString } from "@shopify/react-form";
import {
  SelectPayload,
  Product,
} from "@shopify/app-bridge/actions/ResourcePicker";
import { DatePickerForm } from "./DatePickerForm";

type PickProduct = Pick<Product, "id" | "title" | "images" | "handle">;

export type LabelDataType = {
  labelData?: LabelType;
};

export type LabelType = {
  id: string;
  name: string;
  product: PickProduct;
  variantId: string;
  createdAt: Date;
  updatedAt: Date;
  startAt: Date;
  endAt: Date;
};

type FormFields = {
  name: string;
  variantId: string;
  startAt: Date;
  endAt: Date;
};

export const LabelForm: FC<LabelDataType> = ({ labelData }) => {
  const [label, setLabel] = useState(labelData);
  const [showResourcePicker, setShowResourcePicker] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PickProduct>(
    labelData?.product
  );
  const navigate = useNavigate();
  const appBridge = useAppBridge();
  const fetch = useAuthenticatedFetch();
  const deletedProduct = label?.product?.title === "Deleted product";

  /*
    Sets up the form state with the useForm hook.

    Accepts a "fields" object that sets up each individual field with a default value and validation rules.

    Returns a "fields" object that is destructured to access each of the fields individually, so they can be used in other parts of the component.

    Returns helpers to manage form state, as well as component state that is based on form state.
  */
  const {
    fields: { name, variantId, startAt, endAt },
    dirty,
    reset,
    submitting,
    submit,
    makeClean,
  } = useForm({
    fields: {
      name: useField({
        value: label?.name || "",
        validates: [notEmptyString("Please title")],
      }),

      variantId: useField({
        value: deletedProduct ? "Deleted product" : label?.variantId || "",
        validates: [notEmptyString("Please select a product")],
      }),
      startAt: useField(label?.startAt),
      endAt: useField(label?.endAt),
    },
    onSubmit: useCallback(
      async (body: FormFields) => {
        console.log({ body });
        (async () => {
          const parsedBody = {
            ...body,
          };
          const labelId = label?.id;
          /* construct the appropriate URL to send the API request to based on whether the QR code is new or being updated */
          const url = labelId ? `/api/labels/${labelId}` : "/api/labels";
          /* a condition to select the appropriate HTTP method: PATCH to update a QR code or POST to create a new QR code */
          const method = labelId ? "PATCH" : "POST";
          /* use (authenticated) fetch from App Bridge to send the request to the API and, if successful, clear the form to reset the ContextualSaveBar and parse the response JSON */
          const response = await fetch(url, {
            method,
            body: JSON.stringify(parsedBody),
            headers: { "Content-Type": "application/json" },
          });
          if (response.ok) {
            makeClean();
            const label = await response.json();
            /* if this is a new QR code, then save the QR code and navigate to the edit page; this behavior is the standard when saving resources in the Shopify admin */
            if (!labelId) {
              navigate(`/labels/${label.id}`);
              /* if this is a QR code update, update the QR code state in this component */
            } else {
              setLabel(label);
            }
          }
        })();
        return { status: "success" };
      },
      [label, setLabel]
    ),
  });

  /*
    This function is called with the selected product whenever the user clicks "Add" in the ResourcePicker.

    It takes the first item in the selection array and sets the selected product to an object with the properties from the "selection" argument.

    It updates the form state using the "onChange" methods attached to the form fields.

    Finally, closes the ResourcePicker.
  */
  const handleProductChange = useCallback(({ selection }: SelectPayload) => {
    const selectedProducts = selection as Array<Product>;
    setSelectedProduct({
      id: selectedProducts[0].id,
      title: selectedProducts[0].title,
      images: selectedProducts[0].images,
      handle: selectedProducts[0].handle,
    });
    variantId.onChange(selectedProducts[0].variants[0].id);
    setShowResourcePicker(false);
  }, []);

  /*
    This function is called when a user clicks "Select product" or cancels the ProductPicker.

    It switches between a show and hide state.
  */
  const toggleResourcePicker = useCallback(
    () => setShowResourcePicker(!showResourcePicker),
    [showResourcePicker]
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const deleteQRCode = useCallback(async () => {
    reset();
    /* The isDeleting state disables the download button and the delete QR code button to show the merchant that an action is in progress */
    setIsDeleting(true);
    const response = await fetch(`/api/labels/${label.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      navigate(`/`);
    }
  }, [label]);

  /*
    This function runs when a user clicks the "Go to destination" button.

    It uses data from the App Bridge context as well as form state to construct destination URLs using the URL helpers you created.
  */
  // const goToDestination = useCallback(() => {
  //   if (!selectedProduct) return;
  //   const data = {
  //     host: appBridge.hostOrigin,
  //     productHandle: handle.value || selectedProduct.handle,
  //     discountCode: discountCode.value || undefined,
  //     variantId: variantId.value,
  //   };

  //   const targetURL =
  //     deletedProduct || destination.value[0] === "product"
  //       ? productViewURL(data)
  //       : productCheckoutURL(data);

  //   window.open(targetURL, "_blank", "noreferrer,noopener");
  // }, [label, selectedProduct, destination, discountCode, handle, variantId]);

  /*
      This array is used in a select field in the form to manage discount options
    */
  // const discountOptions = discounts
  //   ? [
  //       NO_DISCOUNT_OPTION,
  //       ...discounts.codeDiscountNodes.edges.map(
  //         ({ node: { id, codeDiscount } }) => {
  //           DISCOUNT_CODES[id] = codeDiscount.codes.edges[0].node.code;

  //           return {
  //             label: codeDiscount.codes.edges[0].node.code,
  //             value: id,
  //           };
  //         }
  //       ),
  //     ]
  //   : [];

  const QRCodeURL = label
    ? new URL(`/qrcodes/${label.id}/image`, location.toString()).toString()
    : null;

  /*
    These variables are used to display product images, and will be populated when image URLs can be retrieved from the Admin.
  */
  const originalImageSrc = selectedProduct?.images?.[0]?.originalSrc;
  const altText =
    selectedProduct?.images?.[0]?.altText || selectedProduct?.title;

  /* The form layout, created using Polaris and App Bridge components. */
  return (
    <VerticalStack>
      {deletedProduct && (
        <Banner
          title="The product for this QR code no longer exists."
          status="critical"
        >
          <p>
            Scans will be directed to a 404 page, or you can choose another
            product for this QR code.
          </p>
        </Banner>
      )}
      <Layout>
        <Layout.Section>
          <Form onSubmit={() => console.log("onSubmit")}>
            <ContextualSaveBar
              saveAction={{
                label: "Save",
                onAction: submit,
                loading: submitting,
                disabled: submitting,
              }}
              discardAction={{
                label: "Discard",
                onAction: reset,
                loading: submitting,
                disabled: submitting,
              }}
              visible={dirty}
              fullWidth
            />
            <FormLayout>
              <AlphaCard>
                <VerticalStack gap="3">
                  <Text as="h2" variant="headingMd">
                    Title
                  </Text>
                  <TextField
                    {...name}
                    label="Title"
                    labelHidden
                    helpText="Only store staff can see this title"
                    autoComplete="off"
                  />
                </VerticalStack>
              </AlphaCard>
              <AlphaCard>
                <VerticalStack gap="3">
                  <HorizontalStack align="space-between">
                    <Text as="h2" variant="headingMd">
                      Product
                    </Text>
                    <Button plain onClick={toggleResourcePicker}>
                      {variantId.value ? "Change product" : "Select product"}
                    </Button>
                  </HorizontalStack>
                  <Box>
                    {showResourcePicker && (
                      <ResourcePicker
                        resourceType="Product"
                        showVariants={false}
                        selectMultiple={false}
                        onCancel={toggleResourcePicker}
                        onSelection={handleProductChange}
                        open
                      />
                    )}
                    {variantId.value ? (
                      <HorizontalStack gap="2" blockAlign="center">
                        {originalImageSrc ? (
                          <Thumbnail source={originalImageSrc} alt={altText} />
                        ) : (
                          <Thumbnail
                            source={ImageMajor}
                            size="small"
                            alt={altText}
                          />
                        )}
                        <Text as="p" variant="headingSm">
                          {selectedProduct.title}
                        </Text>
                      </HorizontalStack>
                    ) : (
                      <VerticalStack gap="3">
                        <ButtonGroup>
                          <Button onClick={toggleResourcePicker}>
                            Select product
                          </Button>
                        </ButtonGroup>
                        {variantId.error && (
                          <HorizontalStack gap="1">
                            <Text as="span">
                              <Icon source={AlertMinor} color="critical" />
                            </Text>
                            <Text as="span" color="critical">
                              {variantId.error}
                            </Text>
                          </HorizontalStack>
                        )}
                      </VerticalStack>
                    )}
                  </Box>
                </VerticalStack>
              </AlphaCard>
              <AlphaCard>
                <VerticalStack gap="3">
                  <Text as="h2" variant="headingMd">
                    Date range
                  </Text>
                  <DatePickerForm startAt={startAt} endAt={endAt} />
                </VerticalStack>
              </AlphaCard>
            </FormLayout>
          </Form>
        </Layout.Section>
        {/* <Layout.Section secondary>
          <AlphaCard>
            <Text as="h2" variant="headingLg">
              Label
            </Text>
            {label ? (
              <EmptyState imageContained={true} image={QRCodeURL} />
            ) : (
              <EmptyState image={""}>
                <p>Your QR code will appear here after you save.</p>
              </EmptyState>
            )}
            <VerticalStack>
              <Button
                fullWidth
                primary
                download
                url={QRCodeURL}
                disabled={!label || isDeleting}
              >
                Download
              </Button>
              <Button
                fullWidth
                onClick={goToDestination}
                disabled={!selectedProduct}
              >
                Go to destination
              </Button> 
            </VerticalStack>
          </AlphaCard>
        </Layout.Section> */}
        <Layout.Section>
          {label?.id && (
            <Button
              outline
              destructive
              onClick={deleteQRCode}
              loading={isDeleting}
            >
              Delete Label
            </Button>
          )}
        </Layout.Section>
      </Layout>
    </VerticalStack>
  );
};

/* Builds a URL to the selected product */
function productViewURL({ host, productHandle, discountCode }: any) {
  const url = new URL(host);
  const productPath = `/products/${productHandle}`;

  /*
    If a discount is selected, then build a URL to the selected discount that redirects to the selected product: /discount/{code}?redirect=/products/{product}
  */
  if (discountCode) {
    url.pathname = `/discount/${discountCode}`;
    url.searchParams.append("redirect", productPath);
  } else {
    url.pathname = productPath;
  }

  return url.toString();
}

/* Builds a URL to a checkout that contains the selected product */
function productCheckoutURL({
  host,
  variantId,
  quantity = 1,
  discountCode,
}: any) {
  const url = new URL(host);
  const id = variantId.replace(
    /gid:\/\/shopify\/ProductVariant\/([0-9]+)/,
    "$1"
  );

  url.pathname = `/cart/${id}:${quantity}`;

  /* Builds a URL to a checkout that contains the selected product with a discount code applied */
  if (discountCode) {
    url.searchParams.append("discount", discountCode);
  }

  return url.toString();
}
