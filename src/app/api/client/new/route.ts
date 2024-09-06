import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  const prisma = new PrismaClient();

  const { name, email, faceImageUrl, faceImageName, hasPermission } =
    await request.json();

  try {
    const client = await prisma.client.create({
      data: {
        name,
        email,
        faceImageUrl,
        faceImageName,
        hasPermission,
      },
    });

    return NextResponse.json({ client });
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
