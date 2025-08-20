import { MapPin, Clock, Building2, Bookmark, Calendar } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface JobListItemProps {
  id?: string;
  title: string;
  company: string;
  location: string;
  deadline: string; // Application deadline in days
  type: string;
  timePosted: string;
  tags: string[];
  logo?: string;
  className?: string;
}

const getDeadlineColor = (deadline: string) => {
  const daysLeft = parseInt(deadline.split(' ')[0]);
  if (daysLeft >= 7) return "text-foreground";
  if (daysLeft >= 4) return "text-yellow-600 dark:text-yellow-400";
  if (daysLeft >= 1) return "text-red-600 dark:text-red-400";
  return "text-red-600 dark:text-red-400";
};

export const JobListItem = ({ 
  id,
  title, 
  company, 
  location, 
  deadline, 
  type, 
  timePosted, 
  tags,
  logo,
  className 
}: JobListItemProps) => {
  const deadlineColorClass = getDeadlineColor(deadline);
  
  const listItemContent = (
    <div className={cn(
      "group hover:shadow-card-hover transition-all duration-300 cursor-pointer",
      "border border-border/50 rounded-2xl bg-gradient-to-br from-card/90 to-card/70",
      "backdrop-blur-xl hover:border-primary/30 hover:-translate-y-1 hover:scale-[1.01]",
      "hover:shadow-2xl hover:shadow-primary/20 p-6",
      className
    )}>
      <div className="flex items-center gap-6">
        {/* Company Logo */}
        <div className="w-16 h-16 rounded-xl bg-gradient-subtle flex items-center justify-center shrink-0 overflow-hidden">
          {logo ? (
            <img src={logo} alt={`${company} logo`} className="w-12 h-12 object-contain" />
          ) : (
            <Building2 className="h-8 w-8 text-primary" />
          )}
        </div>
        
        {/* Job Info - Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2 truncate">
                {title}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Building2 className="h-4 w-4 shrink-0" />
                <span className="font-medium truncate">{company}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary shrink-0">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Details Row */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 shrink-0" />
              <span className="truncate">{timePosted}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 shrink-0" />
              <span className={cn("font-medium truncate", deadlineColorClass)}>
                Ansök senast {deadline}
              </span>
            </div>
          </div>
          
          {/* Tags and Type */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2 min-w-0 flex-1 mr-4">
              <Badge variant="secondary">{type}</Badge>
              {tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3} mer
                </Badge>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
            >
              Visa mer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (id) {
    return (
      <Link to={`/job/${id}`}>
        {listItemContent}
      </Link>
    );
  }

  return listItemContent;
};