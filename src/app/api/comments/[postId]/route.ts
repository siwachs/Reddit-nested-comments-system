import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const mockuserId = "4f948357-48b3-4df1-addb-db7ce88e4799";

const addComment = async (
  req: NextRequest,
  dynamicId: { params: { postId: string } }
) => {
  try {
    const { message, parentId } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json(
        { error: true, message: "Message is required." },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        message,
        postId: dynamicId.params.postId,
        userId: mockuserId,
        parentId,
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
    });

    return NextResponse.json(
      { error: false, message: "Comment created successfully.", comment },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 }
    );
  }
};

export { addComment as POST };
