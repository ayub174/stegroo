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
        "flex items-center justify-center group cursor-pointer transition-all duration-500 hover:scale-105",
        className
      )}
    >
      <div className="relative flex items-center gap-3">
        {/* Stegroo Icon - Modern geometric steps */}
        <div className="relative">
          <div className="flex flex-col items-end justify-center gap-0.5 group-hover:animate-float">
            {/* Three ascending blocks representing growth/steps */}
            <div className="w-2 h-2 bg-blue-600 rounded-sm shadow-lg transform transition-all duration-300 group-hover:shadow-blue-500/50 group-hover:bg-blue-500"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-sm shadow-lg transform transition-all duration-300 group-hover:shadow-blue-500/50 group-hover:bg-blue-500" style={{animationDelay: '0.1s'}}></div>
            <div className="w-4 h-4 bg-blue-600 rounded-md shadow-xl transform transition-all duration-300 group-hover:shadow-blue-500/50 group-hover:bg-blue-500" style={{animationDelay: '0.2s'}}></div>
          </div>
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1 -right-1 w-1 h-1 bg-blue-400/40 rounded-full animate-float opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-2 -left-2 w-0.5 h-0.5 bg-blue-500/60 rounded-full animate-float opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
        
        {/* Stegroo Text */}
        <div className="flex flex-col">
          <span className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors duration-300 leading-none">
            Stegroo
          </span>
          <span className="text-xs font-semibold text-gray-500 group-hover:text-blue-500 transition-colors duration-300 tracking-wider uppercase leading-none">
            Karriärportalen
          </span>
        </div>
        
        {/* Animated underline */}
        <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-500 rounded-full"></div>
        
        {/* Glow effect behind logo */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-blue-600/20 to-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-150 rounded-full"></div>
      </div>
    </Link>
  );
};