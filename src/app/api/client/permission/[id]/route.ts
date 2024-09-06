import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = new PrismaClient();

  const { hasPermission } = await request.json();

  try {
    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: { hasPermission: hasPermission },
    });

    return NextResponse.json({ hasPermission: updatedClient.hasPermission });
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
