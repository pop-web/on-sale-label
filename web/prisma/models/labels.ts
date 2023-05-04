import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getLabel = async (id: number) => {
  return await prisma.label.findFirst({
    where: { id },
  });
};

const createLabel = async (data: Prisma.labelCreateArgs) => {
  return await prisma.label.create({ data: data.data });
};

const getLabels = async () => {
  return await prisma.label.findMany();
};

const updateLabel = async (id: number, data: Prisma.labelCreateArgs) => {
  return await prisma.label.update({
    where: { id },
    data: data.data,
  });
};

export default {
  getLabel,
  createLabel,
  getLabels,
  updateLabel,
};
