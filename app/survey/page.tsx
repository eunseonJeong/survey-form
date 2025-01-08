"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

interface Question {
  id: string;
  text: string;
  type: "text" | "single" | "multiple";
  choices?: string[];
}

type Answer = string | string[];

export default function SurveyPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
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
      localStorage.setItem("surveyAnswers", JSON.stringify(answers));
      router.push("/survey/success");
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleTextAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const handleSingleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const handleMultipleAnswer = (choice: string) => {
    const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
    let newAnswers: string[];

    if (currentAnswers.includes(choice)) {
      newAnswers = currentAnswers.filter((a) => a !== choice);
    } else {
      newAnswers = [...currentAnswers, choice];
    }

    setAnswers({ ...answers, [currentQuestion.id]: newAnswers });
  };

  const isAnswered = () => {
    const currentAnswer = answers[currentQuestion.id];
    if (!currentAnswer) return false;

    if (currentQuestion.type === "multiple") {
      return (currentAnswer as string[]).length > 0;
    }

    return true;
  };

  if (questions.length === 0) return <div>설문 문항이 없습니다.</div>;
  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4 text-sm text-gray-500 text-right">
          {currentQuestionIndex + 1} / {questions.length}
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">설문 조사</h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">{currentQuestion.text}</h2>

          {currentQuestion.type === "text" && (
            <Input
              type="text"
              value={(answers[currentQuestion.id] as string) || ""}
              onChange={(e) => handleTextAnswer(e.target.value)}
              className="w-full"
              placeholder="답변을 입력해주세요"
            />
          )}

          {currentQuestion.type === "single" && (
            <div className="space-y-2">
              {currentQuestion.choices?.map((choice, index) => (
                <Button
                  key={index}
                  onClick={() => handleSingleAnswer(choice)}
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

          {currentQuestion.type === "multiple" && (
            <div className="space-y-3">
              {currentQuestion.choices?.map((choice, index) => (
                <label
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                >
                  <Checkbox
                    checked={(
                      (answers[currentQuestion.id] as string[]) || []
                    ).includes(choice)}
                    onCheckedChange={() => handleMultipleAnswer(choice)}
                  />
                  <span>{choice}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleNext}
            className="w-full"
            disabled={!isAnswered()}
          >
            {isLastQuestion ? "제출" : "다음"}
          </Button>

          {currentQuestionIndex > 0 && (
            <Button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              variant="outline"
              className="w-full"
            >
              이전
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
