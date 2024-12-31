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
  type: "text" | "choice";
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">설문 관리</h1>
      <div className="space-y-4 mb-8">
        <Input
          placeholder="질문"
          value={newQuestion.text}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, text: e.target.value })
          }
        />
        <Select
          value={newQuestion.type}
          onValueChange={(value) =>
            setNewQuestion({ ...newQuestion, type: value as "text" | "choice" })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="질문 유형 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">텍스트</SelectItem>
            <SelectItem value="choice">선택형</SelectItem>
          </SelectContent>
        </Select>
        {newQuestion.type === "choice" && (
          <div className="space-y-2">
            {newQuestion.choices?.map((choice, index) => (
              <Input
                key={index}
                placeholder={`선택지 ${index + 1}`}
                value={choice}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
              />
            ))}
            <Button onClick={handleAddChoice}>선택지 추가</Button>
          </div>
        )}
        <Button onClick={handleAddQuestion}>질문 추가</Button>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">현재 질문 목록</h2>
        {questions.map((q) => (
          <div key={q.id} className="mb-2">
            <p>
              <strong>{q.text}</strong> ({q.type})
            </p>
            {q.choices && (
              <ul className="list-disc list-inside">
                {q.choices.map((choice, index) => (
                  <li key={index}>{choice}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
