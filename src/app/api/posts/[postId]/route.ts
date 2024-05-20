import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getPost = async (
  req: NextRequest,
  dynamicId: { params: { postId: string } }
) => {
  try {
    const id = dynamicId.params.postId;

    const post = await prisma.post.findUnique({
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

    if (!post) {
      return NextResponse.json(
        {
          error: true,
          message: "Post not found.",
          post: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: false,
        post,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: true, message: error.message, post: null },
      { status: 500 }
    );
  }
};

export { getPost as GET };
