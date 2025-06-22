import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: NextRequest) {
  try {
    const { url, filename } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL이 필요합니다." }, { status: 400 });
    }

    // Puppeteer 브라우저 실행
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    // 페이지 설정
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 2, // 고해상도
    });

    // 페이지 로드
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // 동적 콘텐츠 로딩 대기
    await page.waitForSelector(".report-content", { timeout: 10000 });

    // 프린트용 스타일 적용 - 색상 문제 완전 해결
    await page.addStyleTag({
      content: `
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        .print\\:hidden {
          display: none !important;
        }
        
        body {
          font-size: 12pt;
          line-height: 1.4;
          background-color: #ffffff !important;
        }
        
        /* 모든 그라데이션을 단색으로 변경 */
        .bg-gradient-to-r,
        .bg-gradient-to-br,
        .bg-gradient-to-l,
        .bg-gradient-to-t,
        .bg-gradient-to-b {
          background-image: none !important;
          background: #ffffff !important;
        }
        
        /* 보라색 배경들을 흰색으로 변경 */
        .from-purple-50,
        .to-purple-100,
        .from-purple-100,
        .to-purple-200,
        .bg-purple-50,
        .bg-purple-100,
        .bg-purple-200 {
          background-color: #ffffff !important;
        }
        
        /* 섹션별 배경색을 모두 흰색으로 통일 */
        .from-indigo-50,
        .to-blue-50,
        .from-pink-50,
        .to-purple-50,
        .from-green-50,
        .to-emerald-50,
        .from-orange-50,
        .to-red-50,
        .from-cyan-50,
        .to-teal-50,
        .from-yellow-50,
        .to-amber-50 {
          background-color: #ffffff !important;
        }
        
        /* 텍스트 색상은 유지 */
        .text-purple-600, .text-purple-700 { color: #8b5cf6 !important; }
        .text-pink-600, .text-pink-700 { color: #ec4899 !important; }
        .text-green-600, .text-green-700 { color: #059669 !important; }
        .text-blue-600, .text-blue-700 { color: #2563eb !important; }
        .text-indigo-600, .text-indigo-700 { color: #4f46e5 !important; }
        .text-orange-600, .text-orange-700 { color: #ea580c !important; }
        .text-cyan-600, .text-cyan-700 { color: #0891b2 !important; }
        .text-yellow-600, .text-yellow-700 { color: #ca8a04 !important; }
        .text-gray-600, .text-gray-700, .text-gray-800 { color: #374151 !important; }
        
        /* 카드 배경들 */
        .bg-white\\/90,
        .bg-white\\/80,
        .bg-white\\/50 {
          background-color: #ffffff !important;
        }
        
        /* 테두리 색상 유지 */
        .border-purple-100 { border-color: #ede9fe !important; }
        .border-purple-200 { border-color: #ddd6fe !important; }
        .border-pink-200 { border-color: #fbcfe8 !important; }
        .border-green-200 { border-color: #bbf7d0 !important; }
        .border-blue-200 { border-color: #bfdbfe !important; }
        .border-gray-200 { border-color: #e5e7eb !important; }
      `,
    });

    // PDF 생성
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: `
        <div style="font-size: 10px; text-align: center; width: 100%; color: #666;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `,
    });

    await browser.close();

    // PDF 응답 반환
    const encodedFilename = encodeURIComponent(`${filename || "report"}.pdf`);
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodedFilename}`,
      },
    });
  } catch (error) {
    console.error("PDF 생성 오류:", error);
    return NextResponse.json(
      { error: "PDF 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
