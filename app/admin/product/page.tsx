"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type Prize = {
  name: string;
  probability: string;
};

//가챠를 등록하는 확률 페이지
const ProductPage = () => {
  const [prizes, setPrizes] = useState<Prize[]>([
    { name: "", probability: "" },
  ]);

  const [savedPrizes, setSavedPrizes] = useState<Prize[]>(() => {
    // 로컬 스토리지에서 저장된 값 가져오기
    const storedPrizes = localStorage.getItem("savedPrizes");
    return storedPrizes ? JSON.parse(storedPrizes) : [];
  });

  const addPrize = () => {
    setPrizes([...prizes, { name: "", probability: "" }]);
  };

  const removePrize = (index: number) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  const updatePrize = (index: number, field: keyof Prize, value: string) => {
    const newPrizes = [...prizes];
    newPrizes[index][field] = value;
    setPrizes(newPrizes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("등록된 상품:", prizes);

    // 로컬 스토리지에 저장
    localStorage.setItem("savedPrizes", JSON.stringify(prizes));
    setSavedPrizes(prizes); // 저장된 값 상태 업데이트
    setPrizes([{ name: "", probability: "" }]); // 입력 필드 초기화
  };

  const totalProbability = prizes.reduce((sum, prize) => {
    const prob = parseFloat(prize.probability) || 0;
    return sum + prob;
  }, 0);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>상품 등록</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {prizes.map((prize, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="상품명"
                  value={prize.name}
                  onChange={(e) => updatePrize(index, "name", e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  placeholder="확률 (%)"
                  value={prize.probability}
                  onChange={(e) =>
                    updatePrize(index, "probability", e.target.value)
                  }
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full"
                />
              </div>
              {prizes.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removePrize(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={addPrize}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              상품 추가
            </Button>
            <div className="text-sm">
              총 확률: {totalProbability.toFixed(1)}%
            </div>
          </div>

          <Button type="submit" className="w-full mt-6">
            상품 등록
          </Button>
        </form>

        {/* 저장된 상품 목록 표시 */}
        <div className="mt-8">
          <h2 className="text-lg font-bold">저장된 상품</h2>
          {savedPrizes.length === 0 ? (
            <p className="text-sm text-gray-500">저장된 상품이 없습니다.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {savedPrizes.map((prize, index) => (
                <li key={index} className="flex justify-between">
                  <span>{prize.name}</span>
                  <span>{prize.probability}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default ProductPage;
