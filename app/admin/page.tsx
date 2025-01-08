"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Question {
  id: string;
  text: string;
  type: "text" | "single" | "multiple";
  choices?: string[];
}

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: "",
    text: "",
    type: "text",
    choices: [],
  });

  useEffect(() => {
    const storedQuestions = localStorage.getItem("surveyQuestions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
  }, []);

  const handleAddQuestion = () => {
    if (!newQuestion.text) {
      alert("질문을 입력해주세요.");
      return;
    }

    if (
      (newQuestion.type === "single" || newQuestion.type === "multiple") &&
      (!newQuestion.choices || newQuestion.choices.length < 2)
    ) {
      alert("선택형 질문은 최소 2개의 선택지가 필요합니다.");
      return;
    }

    const updatedQuestions = [
      ...questions,
      { ...newQuestion, id: Date.now().toString() },
    ];
    setQuestions(updatedQuestions);
    localStorage.setItem("surveyQuestions", JSON.stringify(updatedQuestions));
    setNewQuestion({ id: "", text: "", type: "text", choices: [] });
  };

  const handleAddChoice = () => {
    setNewQuestion({
      ...newQuestion,
      choices: [...(newQuestion.choices || []), ""],
    });
  };

  const handleChoiceChange = (index: number, value: string) => {
    const updatedChoices =
      newQuestion.choices?.map((choice, i) => (i === index ? value : choice)) ||
      [];
    setNewQuestion({ ...newQuestion, choices: updatedChoices });
  };

  const handleRemoveChoice = (index: number) => {
    const updatedChoices =
      newQuestion.choices?.filter((_, i) => i !== index) || [];
    setNewQuestion({ ...newQuestion, choices: updatedChoices });
  };

  const handleRemoveQuestion = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions);
    localStorage.setItem("surveyQuestions", JSON.stringify(updatedQuestions));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">설문 관리</h1>
      <div className="space-y-4 mb-8 bg-gray-50 p-6 rounded-lg">
        <Input
          placeholder="질문을 입력하세요"
          value={newQuestion.text}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, text: e.target.value })
          }
        />
        <Select
          value={newQuestion.type}
          onValueChange={(value) =>
            setNewQuestion({
              ...newQuestion,
              type: value as "text" | "single" | "multiple",
              choices: value === "text" ? [] : newQuestion.choices,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="질문 유형 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">텍스트</SelectItem>
            <SelectItem value="single">단일 선택형</SelectItem>
            <SelectItem value="multiple">복수 선택형</SelectItem>
          </SelectContent>
        </Select>
        {(newQuestion.type === "single" || newQuestion.type === "multiple") && (
          <div className="space-y-2">
            {newQuestion.choices?.map((choice, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`선택지 ${index + 1}`}
                  value={choice}
                  onChange={(e) => handleChoiceChange(index, e.target.value)}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveChoice(index)}
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={handleAddChoice}
              className="w-full"
            >
              선택지 추가
            </Button>
          </div>
        )}
        <Button onClick={handleAddQuestion} className="w-full">
          질문 추가
        </Button>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-2">현재 질문 목록</h2>
        {questions.map((q) => (
          <div key={q.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold">{q.text}</p>
                <p className="text-sm text-gray-500">
                  {q.type === "text" && "텍스트 응답"}
                  {q.type === "single" && "단일 선택형"}
                  {q.type === "multiple" && "복수 선택형"}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveQuestion(q.id)}
              >
                삭제
              </Button>
            </div>
            {q.choices && (
              <ul className="list-disc list-inside space-y-1">
                {q.choices.map((choice, index) => (
                  <li key={index} className="text-gray-700">
                    {choice}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
