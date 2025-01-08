"use client";

import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const SuccessPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          설문 조사 완료입니다
        </h1>

        <p className="text-gray-600 mb-8">
          소중한 의견을 공유해 주셔서 감사합니다. 더 나은 서비스를 제공하기 위해
          노력하겠습니다.
        </p>

        <button
          className="bg-green-500 text-white px-6 py-2 rounded-lg 
                     hover:bg-green-600 transition-colors duration-200"
          onClick={() => router.push("/")}
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
