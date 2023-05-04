import shopify from "../shopify";
import express from "express";
import { type Session, GraphqlQueryError } from "@shopify/shopify-api";
import label from "../prisma/models/labels";

const PRODUCT_VARIANT_QUERY = `
  query productVariant($id: ID!){
    productVariant(id: $id) {
      id
      product{
        title
        handle
        images(first:1){
          edges{
            node{
              url
            }
          }
        }
      }
    }
  }
`;

const labelRoutes = express.Router();

labelRoutes.post("/", async (req, res) => {
  const reqBody = req.body;

  try {
    const labelDate = await label.createLabel({
      data: reqBody,
    });
    res.status(200).send(labelDate);
  } catch (error) {
    console.log(`Failed to process label create: ${(error as Error).message}`);
    res.status(500).send((error as Error).message);
  }
});

labelRoutes.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const labelData = await label.getLabel(Number(id));

    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    const { body } = await client.query({
      data: {
        query: PRODUCT_VARIANT_QUERY,
        variables: {
          id: labelData?.variantId,
        },
      },
    });

    const productVariant = (body as any).data.productVariant;

    res.status(200).send({
      ...labelData,
      product: {
        id: productVariant.id,
        title: productVariant.product.title,
        images: productVariant.product.images.edges.map((edge: any) => ({
          id: edge.node.id,
          originalSrc: edge.node.url,
        })),
        handle: productVariant.product.handle,
      },
    });
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }

  // if (qrcode) {
  //   const formattedQrCode = await formatQrCodeResponse(req, res, [qrcode]);
  //   res.status(200).send(formattedQrCode[0]);
  // }
});

labelRoutes.get("/", async (_req, res) => {
  try {
    const labelsData = await label.getLabels();

    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    const newLabelsData = await Promise.all(
      labelsData.map(async (labelData) => {
        const { body } = await client.query({
          data: {
            query: PRODUCT_VARIANT_QUERY,
            variables: {
              id: labelData?.variantId,
            },
          },
        });
        const productVariant = (body as any).data.productVariant;
        return {
          ...labelData,
          product: {
            id: productVariant.id,
            title: productVariant.product.title,
            images: productVariant.product.images.edges.map((edge: any) => ({
              id: edge.node.id,
              originalSrc: edge.node.url,
            })),
            handle: productVariant.product.handle,
          },
        };
      })
    );

    res.status(200).send(newLabelsData);
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
});

labelRoutes.get("/count", async (_req, res) => {
  try {
    const countData = await shopify.api.rest.Product.count({
      session: res.locals.shopify.session,
    });
    res.status(200).send(countData);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
});

labelRoutes.get("/create/:product_count", async (req, res) => {
  const { product_count } = req.params;
  let status = 200;
  let error = null;
  try {
    // await productCreator(res.locals.shopify.session, +product_count);
  } catch (e) {
    console.log(`Failed to process products/create: ${(e as Error).message}`);
    status = 500;
    error = (e as Error).message;
  }
  res.status(status).send({ success: status === 200, error });
});

export default labelRoutes;
