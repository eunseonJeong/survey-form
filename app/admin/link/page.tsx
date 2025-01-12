"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy } from "lucide-react";

interface LinkPageProps {
  defaultId?: string;
}

const LinkPage = ({ defaultId = "survey" }: LinkPageProps) => {
  const router = useRouter();
  const [id, setId] = useState(defaultId);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(id);
      alert("링크가 복사되었습니다");
    } catch (error) {
      alert("링크 복사 중 오류가 발생했습니다");
    }
  };

  const onClickLink = () => {
    router.push("/survey");
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <div className="space-y-6 bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          링크가 생성되었습니다
        </h1>

        <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 truncate flex-1">
            {id || "생성된 링크가 없습니다"}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            복사하기
          </Button>
        </div>

        <Button onClick={onClickLink} className="w-full">
          생성된 링크로 이동하기
        </Button>
      </div>
    </div>
  );
};

export default LinkPage;
