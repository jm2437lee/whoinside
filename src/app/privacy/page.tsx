"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold text-purple-800 mb-8">
          개인정보처리방침
        </h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-3">
              1. 개인정보의 처리 목적
            </h2>
            <p className="leading-relaxed">
              Who Inside(이하 &apos;회사&apos;)는 다음의 목적을 위하여
              개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의
              용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의
              동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>감정 성향 테스트 결과 제공</li>
              <li>테스트 결과 리포트 이메일 발송</li>
              <li>서비스 이용 통계 및 분석</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-3">
              2. 수집하는 개인정보 항목
            </h2>
            <p className="leading-relaxed">
              회사는 다음과 같은 개인정보 항목을 수집합니다:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>이메일 주소</li>
              <li>닉네임</li>
              <li>감정 성향 테스트 응답 및 결과</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-3">
              3. 개인정보의 보유 및 이용기간
            </h2>
            <p className="leading-relaxed">
              회사는 수집한 개인정보를 다음과 같이 보유 및 이용합니다:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>
                닉네임, 이메일 및 테스트 결과: 서비스 제공 목적으로 6개월간 보관
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-3">
              4. 개인정보의 파기절차 및 방법
            </h2>
            <p className="leading-relaxed">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
              불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>수집된 모든 개인정보는 보유기간 종료 후 즉시 파기됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-3">
              5. 개인정보의 안전성 확보조치
            </h2>
            <p className="leading-relaxed">
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
              있습니다:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>개인정보의 암호화</li>
              <li>
                해킹이나 컴퓨터 바이러스로부터 보호하기 위한 보안프로그램 설치
              </li>
              <li>개인정보에 대한 접근 제한</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-3">
              6. 개인정보 보호책임자
            </h2>
            <p className="leading-relaxed">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
              같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="mt-2">
              <p>• 개인정보 보호책임자</p>
              <p className="ml-4">- 이메일: jamescode.kr@gmail.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-3">
              7. 개인정보처리방침의 변경
            </h2>
            <p className="leading-relaxed">
              이 개인정보처리방침은 2024년 1월 1일부터 적용됩니다. 법령 및
              방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는
              변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
