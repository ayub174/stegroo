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
      <div className="relative flex items-center gap-2">
        {/* Modern integrated logo design */}
        <div className="relative flex items-center">
          {/* Stylized 'S' with geometric elements */}
          <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
            {/* 'S' shape with steps/career progression concept */}
            <svg width="28" height="28" viewBox="0 0 28 28" className="text-white">
              <path 
                d="M8 6 L20 6 A2 2 0 0 1 22 8 L22 10 A2 2 0 0 1 20 12 L12 12 A2 2 0 0 0 10 14 L10 16 A2 2 0 0 0 12 18 L20 18 A2 2 0 0 1 22 20 L22 22 A2 2 0 0 1 20 24 L8 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                className="group-hover:stroke-blue-100 transition-colors duration-300"
              />
              {/* Career steps as small dots */}
              <circle cx="6" cy="8" r="1.5" fill="currentColor" className="opacity-60" />
              <circle cx="6" cy="14" r="1.5" fill="currentColor" className="opacity-80" />
              <circle cx="6" cy="20" r="1.5" fill="currentColor" />
            </svg>
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-blue-400/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          </div>
          
          {/* Integrated text design */}
          <div className="ml-3 flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black bg-gradient-to-r from-gray-900 via-blue-700 to-blue-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-blue-500 transition-all duration-300 leading-none">
                tegroo
              </span>
              {/* Small career steps indicator */}
              <div className="flex gap-0.5 ml-1 mb-1">
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                <div className="w-1 h-1.5 bg-blue-500 rounded-full"></div>
                <div className="w-1 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <span className="text-xs font-bold text-gray-500 group-hover:text-blue-500 transition-colors duration-300 tracking-wider uppercase leading-none -mt-0.5">
              Din karriärresna börjar här
            </span>
          </div>
        </div>
        
        {/* Dynamic underline that grows */}
        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 group-hover:w-full transition-all duration-700 rounded-full"></div>
        
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-blue-600/10 to-blue-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 scale-110 rounded-2xl"></div>
      </div>
    </Link>
  );
};