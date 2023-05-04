import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getLabel = async (id: number) => {
  return await prisma.label.findFirst({
    where: {
      id,
    },
  });
};

const createLabel = async (data: Prisma.labelCreateArgs) => {
  return await prisma.label.create({ data: data.data });
};

const getLabels = async () => {
  return await prisma.label.findMany();
};

export default {
  getLabel,
  createLabel,
  getLabels,
};
