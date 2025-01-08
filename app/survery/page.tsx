"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  text: string;
  type: "text" | "choice";
  choices?: string[];
}

export default function SurveyPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    const storedQuestions = localStorage.getItem("surveyQuestions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleNext = () => {
    if (isLastQuestion) {
      console.log("Survey completed:", answers);
      router.push("/survery/success");
      // 여기에 제출 로직을 추가할 수 있습니다.
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  if (questions.length === 0) return <div>설문 문항이 없습니다.</div>;
  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">설문 조사</h1>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">{currentQuestion.text}</h2>
          {currentQuestion.type === "text" ? (
            <Input
              type="text"
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full"
            />
          ) : (
            <div className="space-y-2">
              {currentQuestion.choices?.map((choice, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(choice)}
                  variant={
                    answers[currentQuestion.id] === choice
                      ? "default"
                      : "outline"
                  }
                  className="w-full justify-start"
                >
                  {choice}
                </Button>
              ))}
            </div>
          )}
        </div>
        <Button
          onClick={handleNext}
          className="w-full"
          disabled={!answers[currentQuestion.id]}
        >
          {isLastQuestion ? "제출" : "다음"}
        </Button>
      </div>
    </div>
  );
}
