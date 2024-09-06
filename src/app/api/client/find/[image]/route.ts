import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { image: string } }
) {
  const prisma = new PrismaClient();

  try {
    const client = await prisma.client.findFirst({
      where: {
        faceImageName: params.image,
      },
    });
    return NextResponse.json(client);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
