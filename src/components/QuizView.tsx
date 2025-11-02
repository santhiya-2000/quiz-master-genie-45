import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Question } from "@/pages/Index";

interface QuizViewProps {
  questions: Question[];
  onComplete: (answers: Record<number, string>) => void;
  onBack: () => void;
}

export const QuizView = ({ questions, onComplete, onBack }: QuizViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentIndex]: answer });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isAnswered = answers[currentIndex] !== undefined;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 mx-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Object.keys(answers).length} answered
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <Card className="p-8 space-y-6 shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {currentQuestion.type}
            </span>
            <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
              Question {currentIndex + 1}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-foreground">
            {currentQuestion.question}
          </h3>
        </div>

        <div className="space-y-4">
          {currentQuestion.type === "MCQ" && currentQuestion.options && (
            <RadioGroup
              value={answers[currentIndex] || ""}
              onValueChange={handleAnswer}
            >
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <Card
                    key={idx}
                    className={`p-4 cursor-pointer transition-all ${
                      answers[currentIndex] === option
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <RadioGroupItem value={option} id={`option-${idx}`} className="mt-1" />
                      <span className="flex-1">{option}</span>
                    </label>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          )}

          {currentQuestion.type === "True/False" && (
            <RadioGroup
              value={answers[currentIndex] || ""}
              onValueChange={handleAnswer}
            >
              <div className="grid grid-cols-2 gap-4">
                {["True", "False"].map((option) => (
                  <Card
                    key={option}
                    className={`p-6 cursor-pointer transition-all ${
                      answers[currentIndex] === option
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <RadioGroupItem value={option} id={option} />
                      <span className="text-lg font-semibold">{option}</span>
                    </label>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          )}

          {(currentQuestion.type === "One Word" ||
            currentQuestion.type === "Brief" ||
            currentQuestion.type === "Long Answer") && (
            <Textarea
              placeholder="Type your answer here..."
              value={answers[currentIndex] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              className={`min-h-[${
                currentQuestion.type === "Long Answer" ? "300" : "150"
              }px] resize-none`}
            />
          )}
        </div>
      </Card>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isAnswered}
          className="flex-1 bg-gradient-to-r from-primary to-secondary"
        >
          {currentIndex < questions.length - 1 ? (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Complete Quiz
              <Check className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
