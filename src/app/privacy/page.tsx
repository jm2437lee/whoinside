import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">개인정보 처리방침</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-2">1. 수집하는 개인정보</h2>
          <p>서비스 제공을 위해 다음의 개인정보를 수집합니다:</p>
          <p className="ml-4 mt-1">• 이메일 주소</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">2. 수집 목적</h2>
          <p>
            수집된 이메일은 서비스 이용 관련 정보 제공 목적으로만 사용됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">3. 개인정보 보유기간</h2>
          <p>서비스 이용 종료 또는 이용자의 삭제 요청 시까지 보관됩니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">4. 이용자 권리</h2>
          <p>이용자는 언제든지 자신의 개인정보 삭제를 요청할 수 있습니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">5. 문의하기</h2>
          <p>개인정보 관련 문의: jamescode.kr@gmail.com </p>
        </section>

        <p className="text-sm text-gray-600 mt-8">시행일자: 2025년 5월 1일</p>
      </div>
    </div>
  );
}
