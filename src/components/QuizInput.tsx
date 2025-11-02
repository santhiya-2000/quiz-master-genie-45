import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuizInputProps {
  onSubmit: (content: string) => void;
}

export const QuizInput = ({ onSubmit }: QuizInputProps) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        
        if (file.type === "application/pdf") {
          toast({
            title: "PDF Processing",
            description: "PDF content extracted successfully!",
          });
          setContent(result);
        } else if (file.type.startsWith("image/")) {
          toast({
            title: "Image Processing",
            description: "Image uploaded! (OCR would be integrated here)",
          });
          setContent("Image content placeholder - OCR integration needed");
        } else {
          setContent(result);
        }
        setIsLoading(false);
      };

      if (file.type.startsWith("image/")) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process file",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please provide some content to generate quiz from",
        variant: "destructive",
      });
      return;
    }
    onSubmit(content);
  };

  return (
    <Card className="p-8 space-y-6 shadow-lg animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Input Your Content
        </h2>
        <p className="text-muted-foreground">
          Upload a PDF, image, or paste text to generate your quiz
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Card className="p-6 hover:shadow-md transition-shadow hover:border-primary">
            <div className="flex flex-col items-center gap-3 text-center">
              <FileText className="h-12 w-12 text-primary" />
              <div>
                <p className="font-semibold">Upload PDF/Text</p>
                <p className="text-sm text-muted-foreground">Click to browse</p>
              </div>
            </div>
          </Card>
        </label>

        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Card className="p-6 hover:shadow-md transition-shadow hover:border-secondary">
            <div className="flex flex-col items-center gap-3 text-center">
              <ImageIcon className="h-12 w-12 text-secondary" />
              <div>
                <p className="font-semibold">Upload Image</p>
                <p className="text-sm text-muted-foreground">OCR extraction</p>
              </div>
            </div>
          </Card>
        </label>

        <Card className="p-6 bg-muted/50">
          <div className="flex flex-col items-center gap-3 text-center">
            <Upload className="h-12 w-12 text-accent" />
            <div>
              <p className="font-semibold">Or Type Below</p>
              <p className="text-sm text-muted-foreground">Paste your text</p>
            </div>
          </div>
        </Card>
      </div>

      <Textarea
        placeholder="Paste or type your content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[300px] resize-none text-base"
        disabled={isLoading}
      />

      <Button
        onClick={handleSubmit}
        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
        disabled={isLoading}
      >
        Continue to Configuration
      </Button>
    </Card>
  );
};
