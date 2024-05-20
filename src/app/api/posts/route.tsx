import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getPosts = async (req: NextRequest) => {
  try {
    const getPostsLinks = req.nextUrl.searchParams.get("getPostsLinks");
    if (getPostsLinks && getPostsLinks === "true") {
      const postsLinks = await prisma.post.findMany({
        select: {
          id: true,
          title: true,
        },
      });

      return NextResponse.json(
        {
          error: false,
          postsLinks: postsLinks ?? [],
        },
        { status: 200 }
      );
    }

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        {
          error: true,
          message: "Post id not found.",
        },
        { status: 404 }
      );
    }

    const posts = await prisma.post.findUnique({
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

    return NextResponse.json(
      {
        error: false,
        posts: posts ?? [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: true, message: error.message, posts: [], postsLinks: [] },
      { status: 500 }
    );
  }
};

export { getPosts as GET };
