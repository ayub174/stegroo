import { MapPin, Clock, Building2, Calendar } from "lucide-react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

interface CompactJobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  deadline: string;
  type: string;
  timePosted: string;
  tags: string[];
  logo?: string;
  isSelected?: boolean;
  onClick: () => void;
}

const getDeadlineColor = (deadline: string) => {
  const daysLeft = parseInt(deadline.split(' ')[0]);
  if (daysLeft >= 7) return "text-foreground";
  if (daysLeft >= 4) return "text-yellow-600 dark:text-yellow-400";
  if (daysLeft >= 1) return "text-red-600 dark:text-red-400";
  return "text-red-600 dark:text-red-400";
};

export const CompactJobCard = ({ 
  title, 
  company, 
  location, 
  deadline, 
  type, 
  timePosted, 
  tags,
  logo,
  isSelected,
  onClick
}: CompactJobCardProps) => {
  const deadlineColorClass = getDeadlineColor(deadline);
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group hover:shadow-card-hover transition-all duration-300 cursor-pointer p-4",
        "border border-border/50 rounded-2xl bg-gradient-to-br from-card/90 to-card/70",
        "backdrop-blur-xl hover:border-primary/30 hover:-translate-y-1",
        "hover:shadow-xl hover:shadow-primary/10",
        isSelected && "border-primary/50 bg-primary/5 shadow-lg"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Company Logo */}
        <div className="w-12 h-12 rounded-xl bg-gradient-subtle flex items-center justify-center shrink-0">
          {logo ? (
            <img src={logo} alt={`${company} logo`} className="w-8 h-8 object-contain" />
          ) : (
            <Building2 className="h-6 w-6 text-primary" />
          )}
        </div>
        
        {/* Job Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1 truncate">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground mb-2">
            <Building2 className="h-3 w-3 shrink-0" />
            <span className="text-sm font-medium truncate">{company}</span>
          </div>
          
          {/* Details */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 shrink-0" />
              <span className="truncate">{timePosted}</span>
            </div>
          </div>
          
          {/* Deadline */}
          <div className="flex items-center gap-1 mb-3">
            <Calendar className="h-3 w-3 shrink-0" />
            <span className={cn("text-xs font-medium", deadlineColorClass)}>
              {deadline}
            </span>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs px-2 py-0.5">{type}</Badge>
            {tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};