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
  onClose
}: JobDetailPanelProps) => {
  if (!job) {
    return <div className="h-full flex items-center justify-center text-center p-8 relative">
        <div className="space-y-6 animate-fade-in">
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Välj ett jobb</h3>
            <p className="text-muted-foreground text-sm">
              Klicka på ett jobb i listan för att se detaljerad information här.
            </p>
          </div>
        </div>
        
        {/* Animated Arrow pointing left */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 animate-pulse">
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
  return <div className="h-full overflow-y-auto bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border border-border/50 rounded-2xl relative">
      {/* Close Button */}
      {onClose && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="absolute top-1 right-1 z-10 h-7 w-7 p-0 hover:bg-muted/50 rounded-full transition-all duration-200 hover:scale-110"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </Button>
      )}
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-subtle flex items-center justify-center shrink-0">
            {job.logo ? <img src={job.logo} alt={`${job.company} logo`} className="w-12 h-12 object-contain" /> : <Building2 className="h-8 w-8 text-primary" />}
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-foreground mb-2 leading-tight">
              {job.title}
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="font-semibold">{job.company}</span>
            </div>
          </div>
          
          <div className="flex gap-2 shrink-0">
            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-medium">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>{job.timePosted}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className={cn("font-medium", deadlineColorClass)}>
              Sista ansökningsdag: {job.deadline}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="px-3 py-1">{job.type}</Badge>
          {job.tags.map((tag, index) => <Badge key={index} variant="outline" className="px-3 py-1">
              {tag}
            </Badge>)}
        </div>

        <Separator />

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Om rollen</h3>
          <p className="text-muted-foreground leading-relaxed">
            {job.description}
          </p>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button className="flex-1" size="lg">
            Ansök nu
          </Button>
          <Button variant="outline" size="lg" asChild className="flex-1">
            <Link to={`/job/${job.id}`} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Visa fullständig annons
            </Link>
          </Button>
        </div>
      </div>
    </div>;
};