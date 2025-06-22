import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; section: string }> }
) {
  try {
    const { type, section } = await params;

    // 유효한 타입과 섹션인지 확인
    const validTypes = ["a1", "a2", "b1", "b2", "c1", "c2", "d1", "d2"];
    const validSections = ["p1", "p2", "p3", "p4", "p5", "p6"];

    if (
      !validTypes.includes(type.toLowerCase()) ||
      !validSections.includes(section.toLowerCase())
    ) {
      return NextResponse.json(
        { error: "Invalid type or section" },
        { status: 400 }
      );
    }

    // 파일 경로 생성
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "paid",
      type.toLowerCase(),
      `${section.toLowerCase()}.json`
    );

    // 파일 존재 확인
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Report data not found" },
        { status: 404 }
      );
    }

    // 파일 읽기
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error loading report data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
