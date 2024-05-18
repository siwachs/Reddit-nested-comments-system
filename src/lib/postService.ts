import { PrismaClient } from "@prisma/client";

const getPostsLinks = async () => {
  const psisma = new PrismaClient();
  try {
    return await psisma.post.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  } catch (error: any) {
    return [];
  }
};

export { getPostsLinks };
