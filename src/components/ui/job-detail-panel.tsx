import { MapPin, Clock, Building2, Calendar, ExternalLink, Bookmark, Share, ChevronLeft, X } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import { Separator } from "./separator";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  deadline: string;
  type: string;
  timePosted: string;
  tags: string[];
  logo?: string;
  description: string;
}
interface JobDetailPanelProps {
  job: Job | null;
  onClose?: () => void;
  hasJobs?: boolean;
}
const getDeadlineColor = (deadline: string) => {
  const daysLeft = parseInt(deadline.split(' ')[0]);
  if (daysLeft >= 7) return "text-foreground";
  if (daysLeft >= 4) return "text-yellow-600 dark:text-yellow-400";
  if (daysLeft >= 1) return "text-red-600 dark:text-red-400";
  return "text-red-600 dark:text-red-400";
};
export const JobDetailPanel = ({
  job,
  onClose,
  hasJobs = true
}: JobDetailPanelProps) => {
  if (!job) {
    // Only show empty state if there are jobs available to select
    if (!hasJobs) {
      return null;
    }
    
    return <div className="h-full flex items-center justify-center text-center p-4 sm:p-8 relative">
        <div className="space-y-6 animate-fade-in">
          <Building2 className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto opacity-50" />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Välj ett jobb</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Klicka på ett jobb i listan för att se detaljerad information här.
            </p>
          </div>
        </div>
        
        {/* Animated Arrow pointing left - Hidden on mobile */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 animate-pulse hidden lg:flex">
          <div className="flex items-center gap-1">
            <ChevronLeft className="h-6 w-6 text-primary animate-bounce" />
            <ChevronLeft className="h-5 w-5 text-primary/60 animate-bounce" style={{
            animationDelay: '0.1s'
          }} />
            <ChevronLeft className="h-4 w-4 text-primary/40 animate-bounce" style={{
            animationDelay: '0.2s'
          }} />
          </div>
        </div>
      </div>;
  }
  
  const deadlineColorClass = getDeadlineColor(job.deadline);
  
  return <div className="h-full overflow-y-auto bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border border-border/50 rounded-2xl lg:rounded-2xl rounded-t-2xl relative">
      {/* Close Button - Positioned better for mobile */}
      {onClose && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="absolute top-2 right-2 z-10 h-8 w-8 p-0 hover:bg-muted/50 rounded-full transition-all duration-200 hover:scale-110 lg:h-7 lg:w-7 lg:top-1 lg:right-1"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </Button>
      )}
      
      <div className="px-2 py-4 sm:px-3 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-subtle flex items-center justify-center shrink-0">
            {job.logo ? <img src={job.logo} alt={`${job.company} logo`} className="w-8 h-8 sm:w-12 sm:h-12 object-contain" /> : <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />}
          </div>
          
          <div className="flex-1 min-w-0 pr-8">
            <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-1 sm:mb-2 leading-tight">
              {job.title}
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground mb-2 sm:mb-3">
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span className="font-semibold text-sm sm:text-base">{job.company}</span>
            </div>
          </div>
          
          <div className="flex gap-1 sm:gap-2 shrink-0">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:h-10 sm:w-10">
              <Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:h-10 sm:w-10">
              <Share className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
            <span className="font-medium">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
            <span>{job.timePosted}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
            <span className={cn("font-medium", deadlineColorClass)}>
              Sista ansökningsdag: {job.deadline}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <Badge variant="secondary" className="px-2 py-1 text-xs sm:px-3 sm:text-sm">{job.type}</Badge>
          {job.tags.map((tag, index) => <Badge key={index} variant="outline" className="px-2 py-1 text-xs sm:px-3 sm:text-sm">
              {tag}
            </Badge>)}
        </div>

        <Separator />

        {/* Description */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Om rollen</h3>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            {job.description}
          </p>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 sm:gap-3 pt-2 sm:pt-4">
          <Button className="w-full" size="lg">
            Ansök nu
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full">
            <Link to={`/job/${job.id}`} className="flex items-center justify-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Visa fullständig annons
            </Link>
          </Button>
        </div>
      </div>
    </div>;
};