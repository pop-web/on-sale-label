import { Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { LabelForm } from "../../components";

export default function ManageCode() {
  const breadcrumbs = [{ content: "Labels", url: "/" }];

  return (
    <Page>
      <TitleBar
        title="Create new Label"
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <LabelForm />
    </Page>
  );
}
