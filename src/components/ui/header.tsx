import { Bell, User, Menu } from "lucide-react";
import { Button } from "./button";
import { Logo } from "./logo";

export const Header = () => {
  return (
    <header className="relative overflow-hidden border-b border-border/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      {/* Dynamic background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-gradient-shift"></div>
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float opacity-30"></div>
      <div className="absolute top-0 right-1/4 w-24 h-24 bg-accent/15 rounded-full blur-2xl animate-float opacity-40" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
        {/* Left Navigation */}
        <nav className="hidden lg:flex items-center gap-8 flex-1">
          <a href="#" className="group relative text-foreground hover:text-primary transition-all duration-300 font-medium">
            Hitta jobb
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-hover group-hover:w-full transition-all duration-300 rounded-full"></div>
          </a>
          <a href="#" className="group relative text-muted-foreground hover:text-primary transition-all duration-300">
            Företag
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-hover group-hover:w-full transition-all duration-300 rounded-full"></div>
          </a>
        </nav>
        
        {/* Center Logo */}
        <div className="flex-shrink-0 relative">
          <Logo className="transform hover:scale-110 transition-transform duration-500" />
          
          {/* Glow effect behind logo */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-150"></div>
        </div>
        
        {/* Right Navigation */}
        <div className="flex items-center gap-6 flex-1 justify-end">
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#" className="group relative text-muted-foreground hover:text-primary transition-all duration-300">
              Karriärguide
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-hover group-hover:w-full transition-all duration-300 rounded-full"></div>
            </a>
            <a href="#" className="group relative text-muted-foreground hover:text-primary transition-all duration-300">
              Löneguide
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-hover group-hover:w-full transition-all duration-300 rounded-full"></div>
            </a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative group hover:bg-primary/10 transition-all duration-300">
              <Bell className="h-5 w-5 group-hover:animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary to-primary-hover rounded-full text-xs animate-pulse shadow-lg shadow-primary/50"></span>
            </Button>
            
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                Logga in
              </Button>
              <Button variant="hero" className="relative overflow-hidden group hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                <span className="relative z-10">Registrera dig</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-hover to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
            
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/10 transition-all duration-300 group">
              <Menu className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom border glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
    </header>
  );
};