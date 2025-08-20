import { Bell, User, Menu } from "lucide-react";
import { Button } from "./button";

export const Header = () => {
  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">J</span>
            </div>
            <span className="text-xl font-bold text-foreground">JobbPortal</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Hitta jobb
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Företag
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Karriärguide
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Löneguide
            </a>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full text-xs"></span>
          </Button>
          
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost">
              Logga in
            </Button>
            <Button variant="hero">
              Registrera dig
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};