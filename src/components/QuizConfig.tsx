import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { QuestionType, Difficulty, Question } from "@/pages/Index";

interface QuizConfigProps {
  questionType: QuestionType;
  difficulty: Difficulty;
  questionCount: number;
  content: string;
  onQuestionTypeChange: (type: QuestionType) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onQuestionCountChange: (count: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  onQuestionsGenerated: (questions: Question[]) => void;
}

export const QuizConfig = ({
  questionType,
  difficulty,
  questionCount,
  content,
  onQuestionTypeChange,
  onDifficultyChange,
  onQuestionCountChange,
  onSubmit,
  onBack,
  onQuestionsGenerated,
}: QuizConfigProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const questionTypes: QuestionType[] = ["MCQ", "True/False", "One Word", "Brief", "Long Answer"];
  const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

  const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
      // Simple text extraction for PDF files (for more robust extraction, consider using pdf-parse)
      if (file.type === 'application/pdf') {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('https://api.pdf.co/v1/pdf/convert/to/text', {
          method: 'POST',
          headers: {
            'x-api-key': import.meta.env.VITE_PDF_CO_API_KEY || ''
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to extract text from PDF');
        }

        const data = await response.json();
        return data.content || '';
      }
      
      // For non-PDF files, use text() method
      return await file.text();
    } catch (error) {
      console.error('Error extracting text from file:', error);
      throw new Error('Failed to process the uploaded file. Please try another file.');
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Check if content is empty
      if (!content) {
        throw new Error('Please provide some content or upload a file to generate a quiz.');
      }

      let processedContent = content;
      
      // If content is a File object (from file upload), extract text
      if (content instanceof File) {
        processedContent = await extractTextFromPdf(content);
        
        // Check if extracted content is empty
        if (!processedContent.trim()) {
          throw new Error('The uploaded file appears to be empty or could not be read.');
        }
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-quiz`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            content: processedContent,
            questionType,
            difficulty,
            questionCount,
          }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz. Please try again.');
      }

      if (!data.questions && !Array.isArray(data)) {
        throw new Error('Invalid response format from the server');
      }

      onQuestionsGenerated(data.questions || data);
      
      toast({
        title: "Quiz Generated!",
        description: `Successfully created ${data.questions?.length || data.length} questions.`,
        variant: "default",
      });
      
      onSubmit();
    } catch (error) {
      console.error('Error generating quiz:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error Generating Quiz",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-8 space-y-8 shadow-lg animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Configure Your Quiz
          </h2>
          <p className="text-muted-foreground">Customize question type and difficulty</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-lg font-semibold">Question Type</Label>
          <RadioGroup value={questionType} onValueChange={(v) => onQuestionTypeChange(v as QuestionType)}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {questionTypes.map((type) => (
                <Card
                  key={type}
                  className={`p-4 cursor-pointer transition-all ${
                    questionType === type
                      ? "border-primary bg-primary/5 shadow-md"
                      : "hover:border-primary/50"
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <RadioGroupItem value={type} id={type} />
                    <span className="font-medium">{type}</span>
                  </label>
                </Card>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-lg font-semibold">Difficulty Level</Label>
          <RadioGroup value={difficulty} onValueChange={(v) => onDifficultyChange(v as Difficulty)}>
            <div className="grid grid-cols-3 gap-3">
              {difficulties.map((level) => (
                <Card
                  key={level}
                  className={`p-4 cursor-pointer transition-all ${
                    difficulty === level
                      ? "border-secondary bg-secondary/5 shadow-md"
                      : "hover:border-secondary/50"
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <RadioGroupItem value={level} id={level} />
                    <span className="font-medium">{level}</span>
                  </label>
                </Card>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Number of Questions</Label>
            <span className="text-2xl font-bold text-primary">{questionCount}</span>
          </div>
          <Slider
            value={[questionCount]}
            onValueChange={(v) => onQuestionCountChange(v[0])}
            min={3}
            max={20}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Sparkles className="mr-2 h-5 w-5 animate-spin" />
            Generating Quiz...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Quiz
          </>
        )}
      </Button>
    </Card>
  );
};
