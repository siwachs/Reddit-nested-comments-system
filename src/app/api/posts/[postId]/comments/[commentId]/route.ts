import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const editComment = async (
  req: NextRequest,
  dynamicId: { params: { commentId: string } }
) => {
  try {
    const { message } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json(
        { error: true, message: "Message is required." },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.update({
      where: { id: dynamicId.params.commentId },
      data: { message },
      select: { message: true },
    });

    return NextResponse.json({ error: false, message }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 }
    );
  }
};

export { editComment as PUT };
