import { useNavigate } from "@shopify/app-bridge-react";
import {
  Card,
  Icon,
  IndexTable,
  Stack,
  TextStyle,
  Thumbnail,
  UnstyledLink,
} from "@shopify/polaris";
import { DiamondAlertMajor, ImageMajor } from "@shopify/polaris-icons";

/* useMedia is used to support multiple screen sizes */
import { useMedia } from "@shopify/react-hooks";

/* dayjs is used to capture and format the date a QR code was created or modified */
import dayjs from "dayjs";
import { FC } from "react";
import { LabelType } from "./LabelForm";
import { Navigate, To } from "@shopify/app-bridge/actions/Navigation/Redirect";

/* Markup for small screen sizes (mobile) */
const SmallScreenCard = ({
  id,
  name,
  product,
  createdAt,
  navigate,
}: {
  id: string;
  name?: string;
  product: LabelType["product"];
  createdAt: Date;
  navigate: Navigate<To>;
}) => {
  return (
    <UnstyledLink onClick={() => navigate(`/labels/${id}`)}>
      <div
        style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #E1E3E5" }}
      >
        <Stack>
          <Stack.Item>
            <Thumbnail
              source={product?.images[0]?.originalSrc || ImageMajor}
              alt="placeholder"
              size="small"
            />
          </Stack.Item>
          <Stack.Item fill>
            <Stack vertical={true}>
              <Stack.Item>
                <p>
                  <TextStyle variation="strong">{truncate(name, 35)}</TextStyle>
                </p>
                <p>{truncate(product?.title, 35)}</p>
                <p>{dayjs(createdAt).format("MMMM D, YYYY")}</p>
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      </div>
    </UnstyledLink>
  );
};

export const LabelIndex: FC<{ labels: LabelType[]; loading: boolean }> = ({
  labels,
  loading,
}) => {
  const navigate = useNavigate();

  /* Check if screen is small */
  const isSmallScreen = useMedia("(max-width: 640px)");

  /* Map over QRCodes for small screen */
  const smallScreenMarkup = labels.map((label) => (
    <SmallScreenCard key={label.id} navigate={navigate} {...label} />
  ));

  const resourceName = {
    singular: "Label",
    plural: "Labels",
  };

  const rowMarkup = labels.map(({ id, name, product, createdAt }, index) => {
    const deletedProduct = product.title.includes("Deleted product");

    /* The form layout, created using Polaris components. Includes the QR code data set above. */
    return (
      <IndexTable.Row
        id={id}
        key={id}
        position={index}
        onClick={() => {
          navigate(`/labels/${id}`);
        }}
      >
        <IndexTable.Cell>
          <Thumbnail
            source={product.images[0]?.originalSrc || ImageMajor}
            alt="placeholder"
            size="small"
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <UnstyledLink data-primary-link url={`/labels/${id}`}>
            {truncate(name, 25)}
          </UnstyledLink>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Stack>
            {deletedProduct && (
              <Icon source={DiamondAlertMajor} color="critical" />
            )}
            <TextStyle variation={deletedProduct ? "negative" : null}>
              {truncate(product?.title, 25)}
            </TextStyle>
          </Stack>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {dayjs(createdAt).format("MMMM D, YYYY")}
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  /* A layout for small screens, built using Polaris components */
  return (
    <Card>
      {isSmallScreen ? (
        smallScreenMarkup
      ) : (
        <IndexTable
          resourceName={resourceName}
          itemCount={labels.length}
          headings={[
            { title: "Thumbnail", hidden: true },
            { title: "Title" },
            { title: "Product" },
            { title: "Date created" },
          ]}
          selectable={false}
          loading={loading}
        >
          {rowMarkup}
        </IndexTable>
      )}
    </Card>
  );
};

/* A function to truncate long strings */
function truncate(str: string, n: number) {
  return str.length > n ? str.substr(0, n - 1) + "…" : str;
}
