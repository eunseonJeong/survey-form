"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

type QuestionType = "text" | "choice";

interface Question {
  id: number;
  text: string;
  type: QuestionType;
  choices?: string[];
}

const questions: Question[] = [
  { id: 1, text: "당신의 이름은 무엇인가요?", type: "text" },
  {
    id: 2,
    text: "당신의 나이대는 어떻게 되나요?",
    type: "choice",
    choices: ["10대", "20대", "30대", "40대", "50대 이상"],
  },
  {
    id: 3,
    text: "이 설문 조사에 대해 어떻게 생각하시나요?",
    type: "choice",
    choices: ["매우 좋음", "좋음", "보통", "나쁨", "매우 나쁨"],
  },
  // 더 많은 질문을 추가할 수 있습니다.
];

export const SurveyForm = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleNext = () => {
    if (isLastQuestion) {
      console.log("Survey completed:", answers);
      // 여기에 제출 로직을 추가할 수 있습니다.
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

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
};
