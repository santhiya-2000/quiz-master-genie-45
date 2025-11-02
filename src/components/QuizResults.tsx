import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Trophy, RotateCcw } from "lucide-react";
import type { Question } from "@/pages/Index";

interface QuizResultsProps {
  questions: Question[];
  userAnswers: Record<number, string>;
  onReset: () => void;
}

export const QuizResults = ({ questions, userAnswers, onReset }: QuizResultsProps) => {
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index]?.toLowerCase().trim();
      const correctAnswer = question.correctAnswer.toLowerCase().trim();
      
      if (question.type === "MCQ" || question.type === "True/False") {
        if (userAnswer === correctAnswer || userAnswer?.includes(correctAnswer.charAt(0))) {
          correct++;
        }
      }
    });
    return correct;
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);

  const getScoreColor = () => {
    if (percentage >= 80) return "text-secondary";
    if (percentage >= 60) return "text-accent";
    return "text-destructive";
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return "Excellent work!";
    if (percentage >= 60) return "Good job!";
    return "Keep practicing!";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-8 text-center space-y-6 shadow-lg bg-gradient-to-br from-card to-primary/5">
        <Trophy className={`h-20 w-20 mx-auto ${getScoreColor()}`} />
        <div>
          <h2 className="text-4xl font-bold mb-2">{getScoreMessage()}</h2>
          <p className="text-muted-foreground">You've completed the quiz!</p>
        </div>
        
        <div className="space-y-2">
          <div className={`text-6xl font-bold ${getScoreColor()}`}>
            {percentage}%
          </div>
          <p className="text-xl text-muted-foreground">
            {score} out of {questions.length} questions correct
          </p>
        </div>

        <Button
          onClick={onReset}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          size="lg"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Create New Quiz
        </Button>
      </Card>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Review Your Answers</h3>
        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer?.toLowerCase().trim().includes(
            question.correctAnswer.toLowerCase().trim().charAt(0)
          );

          return (
            <Card key={index} className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div
                  className={`p-2 rounded-full ${
                    isCorrect ? "bg-secondary/10" : "bg-muted"
                  }`}
                >
                  {isCorrect ? (
                    <Check className="h-5 w-5 text-secondary" />
                  ) : (
                    <X className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Question {index + 1}
                    </span>
                    <h4 className="text-lg font-semibold mt-1">{question.question}</h4>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Your answer:</span>
                      <span className={isCorrect ? "text-secondary" : "text-destructive"}>
                        {userAnswer || "Not answered"}
                      </span>
                    </div>
                    
                    {!isCorrect && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Correct answer:</span>
                        <span className="text-secondary">{question.correctAnswer}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Explanation: </span>
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
