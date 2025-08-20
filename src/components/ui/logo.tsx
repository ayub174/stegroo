import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link 
      to="/" 
      className={cn(
        "flex flex-col items-center justify-center group cursor-pointer transition-all duration-500 hover:scale-105",
        className
      )}
    >
      {/* STEPS text with special E */}
      <div className="flex items-end mb-1 relative">
        <span className="text-2xl font-bold text-primary group-hover:text-primary-hover transition-colors duration-300">
          ST
        </span>
        
        {/* Special E that looks like stairs */}
        <div className="relative mx-1 group-hover:animate-float">
          <div className="flex flex-col items-start justify-end h-7 space-y-px">
            <div className="w-4 h-1.5 bg-gradient-to-r from-primary to-primary-hover rounded-sm transform transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/30"></div>
            <div className="w-3 h-1.5 bg-gradient-to-r from-primary to-primary-hover rounded-sm transform transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/30"></div>
            <div className="w-2 h-1.5 bg-gradient-to-r from-primary to-primary-hover rounded-sm transform transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/30"></div>
          </div>
        </div>
        
        <span className="text-2xl font-bold text-primary group-hover:text-primary-hover transition-colors duration-300">
          PS
        </span>
      </div>
      
      {/* Jobbcenter text */}
      <div className="relative">
        <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary/80 transition-colors duration-300 tracking-wider uppercase">
          Jobbcenter
        </span>
        
        {/* Animated underline */}
        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-hover group-hover:w-full transition-all duration-500 rounded-full"></div>
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1 left-2 w-1 h-1 bg-primary/20 rounded-full animate-float opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-primary/30 rounded-full animate-float opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-2 left-4 w-0.5 h-0.5 bg-primary/25 rounded-full animate-float opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '2s' }}></div>
      </div>
    </Link>
  );
};