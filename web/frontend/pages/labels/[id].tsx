import { useParams } from "react-router-dom";
import { Card, Page, Layout, SkeletonBodyText } from "@shopify/polaris";
import { Loading, TitleBar } from "@shopify/app-bridge-react";
import { useAppQuery } from "../../hooks";
import { LabelForm } from "../../components";
import { LabelType } from "../../components/LabelForm";

export default function labelEdit() {
  const breadcrumbs = [{ content: "Label", url: "/" }];

  const { id } = useParams();

  /*
    Fetch the QR code.
    useAppQuery uses useAuthenticatedQuery from App Bridge to authenticate the request.
    The backend supplements app data with data queried from the Shopify GraphQL Admin API.
  */
  const { data, isLoading, isRefetching } = useAppQuery({
    url: `/api/labels/${id}`,
    reactQueryOptions: {
      /* Disable refetching because the QRCodeForm component ignores changes to its props */
      refetchOnReconnect: false,
    },
  });

  /* Loading action and markup that uses App Bridge and Polaris components */
  if (isLoading || isRefetching) {
    return (
      <Page>
        <TitleBar
          title="Edit Label"
          breadcrumbs={breadcrumbs}
          primaryAction={null}
        />
        <Loading />
        <Layout>
          <Layout.Section>
            <Card sectioned title="Title">
              <SkeletonBodyText />
            </Card>
            <Card title="Product">
              <Card.Section>
                <SkeletonBodyText lines={1} />
              </Card.Section>
              <Card.Section>
                <SkeletonBodyText lines={3} />
              </Card.Section>
            </Card>
            <Card sectioned title="Discount">
              <SkeletonBodyText lines={2} />
            </Card>
          </Layout.Section>
          <Layout.Section secondary>
            <Card sectioned title="Label" />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page>
      <TitleBar
        title="Edit Label"
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <LabelForm labelData={data as LabelType} />
    </Page>
  );
}
