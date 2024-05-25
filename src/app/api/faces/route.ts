import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();

  try {
    const clientsWithPermission = await prisma.client.findMany({
      where: {
        isAllowed: true,
      },
      select: {
        faceImageName: true,
      },
    });

    return NextResponse.json(clientsWithPermission);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
