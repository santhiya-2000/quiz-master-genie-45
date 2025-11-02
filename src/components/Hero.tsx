import { Brain, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b border-border">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-12 w-12 text-primary animate-pulse" />
            <Sparkles className="h-8 w-8 text-accent animate-bounce" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Robo Quizzer
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered quiz generation from any content
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>PDF Support</span>
            </div>
            <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-secondary"></div>
              <span>Image to Text</span>
            </div>
            <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-accent"></div>
              <span>Multiple Question Types</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};
