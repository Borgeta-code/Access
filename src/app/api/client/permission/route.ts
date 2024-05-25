import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, response: NextResponse) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const prisma = new PrismaClient();

  if (!id) {
    return;
  }

  try {
    const client = await prisma.client.findUniqueOrThrow({ where: { id } });

    const updatedClient = await prisma.client.update({
      where: { id },
      data: { isAllowed: !client.isAllowed },
    });

    return NextResponse.json({ isAllowed: updatedClient.isAllowed });
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
