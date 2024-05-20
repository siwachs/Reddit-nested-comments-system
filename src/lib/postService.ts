import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getPostsLinks = async () => {
  try {
    return await prisma.post.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  } catch (error: any) {
    return [];
  }
};

const getPost = async (id: string) => {
  try {
    return await prisma.post.findUnique({
      where: { id },
      select: {
        title: true,
        body: true,
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            message: true,
            parentId: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  } catch (error: any) {
    return null;
  }
};

export { getPostsLinks, getPost };
