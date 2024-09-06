import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      { error: "No valid file received." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${uuidv4()}.jpg`;
  try {
    await writeFile(
      path.join(process.cwd(), "public/faces/" + filename),
      buffer
    );
    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/faces/${filename}`,
      filename,
    });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed to save image." });
  }
};
