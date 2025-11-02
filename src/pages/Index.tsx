import { useState } from "react";
import { Hero } from "@/components/Hero";
import { QuizInput } from "@/components/QuizInput";
import { QuizConfig } from "@/components/QuizConfig";
import { QuizView } from "@/components/QuizView";
import { QuizResults } from "@/components/QuizResults";

export type QuestionType = "MCQ" | "True/False" | "One Word" | "Brief" | "Long Answer";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Question {
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

const Index = () => {
  const [step, setStep] = useState<"input" | "config" | "quiz" | "results">("input");
  const [content, setContent] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("MCQ");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  const handleContentSubmit = (newContent: string) => {
    setContent(newContent);
    setStep("config");
  };

  const handleConfigSubmit = () => {
    setStep("quiz");
  };

  const handleQuizComplete = (answers: Record<number, string>) => {
    setUserAnswers(answers);
    setStep("results");
  };

  const handleReset = () => {
    setStep("input");
    setContent("");
    setQuestions([]);
    setUserAnswers({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Hero />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {step === "input" && (
          <QuizInput onSubmit={handleContentSubmit} />
        )}
        
        {step === "config" && (
          <QuizConfig
            questionType={questionType}
            difficulty={difficulty}
            questionCount={questionCount}
            content={content}
            onQuestionTypeChange={setQuestionType}
            onDifficultyChange={setDifficulty}
            onQuestionCountChange={setQuestionCount}
            onSubmit={handleConfigSubmit}
            onBack={() => setStep("input")}
            onQuestionsGenerated={setQuestions}
          />
        )}
        
        {step === "quiz" && questions.length > 0 && (
          <QuizView
            questions={questions}
            onComplete={handleQuizComplete}
            onBack={() => setStep("config")}
          />
        )}
        
        {step === "results" && (
          <QuizResults
            questions={questions}
            userAnswers={userAnswers}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
