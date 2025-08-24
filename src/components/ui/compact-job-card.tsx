import React from "react";
import { MapPin, Clock, Building2, Calendar, Heart } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { LoginModal } from "./login-modal";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CompactJobCardProps {
  id?: string;
  title: string;
  company: string;
  location: string;
  deadline: string;
  type: string;
  timePosted: string;
  tags: string[];
  logo?: string;
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
  description?: string;
}

const getDeadlineColor = (deadline: string) => {
  const daysLeft = parseInt(deadline.split(' ')[0]);
  if (daysLeft >= 7) return "text-foreground";
  if (daysLeft >= 4) return "text-yellow-600 dark:text-yellow-400";
  if (daysLeft >= 1) return "text-red-600 dark:text-red-400";
  return "text-red-600 dark:text-red-400";
};

export const CompactJobCard = ({ 
  id,
  title, 
  company, 
  location, 
  deadline, 
  type, 
  timePosted, 
  tags,
  logo,
  className,
  isSelected = false,
  onClick,
  description
}: CompactJobCardProps) => {
  const deadlineColorClass = getDeadlineColor(deadline);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if job is already saved on component mount
  React.useEffect(() => {
    if (user && id) {
      checkIfJobSaved();
    }
  }, [user, id]);

  const checkIfJobSaved = async () => {
    if (!user || !id) return;
    
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('user_id', user.id)
        .eq('job_id', id)
        .maybeSingle();
      
      if (!error) {
        setIsSaved(!!data);
      }
    } catch (error) {
      console.error('Error checking saved job:', error);
    }
  };

  const handleSaveJob = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!id) {
      toast({
        title: "Fel",
        description: "Kunde inte spara jobbet. Försök igen senare.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      if (isSaved) {
        // Unsave the job
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', id);
        
        if (error) throw error;
        
        setIsSaved(false);
        toast({
          title: "Jobbet har tagits bort",
          description: "Jobbet har tagits bort från dina sparade jobb.",
        });
      } else {
        // Save the job
        const { error } = await supabase
          .from('saved_jobs')
          .insert({
            user_id: user.id,
            job_id: id,
            job_title: title,
            company,
            location,
            deadline,
            type,
            time_posted: timePosted,
            tags,
            logo,
            description: description || ''
          });
        
        if (error) throw error;
        
        setIsSaved(true);
        toast({
          title: "Jobbet har sparats",
          description: "Du hittar jobbet under 'Sparade jobb' i din profil.",
        });
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      toast({
        title: "Fel",
        description: "Kunde inte spara jobbet. Försök igen senare.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDoubleClick = () => {
    if (id) {
      navigate(`/job/${id}`);
    }
  };

  return (
    <>
      <div 
        className={cn(
          "group relative p-3 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer",
          isSelected 
            ? "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30 shadow-lg" 
            : "bg-gradient-subtle border-border/50 hover:border-primary/30 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/20",
          className
        )}
        onClick={onClick}
        onDoubleClick={handleDoubleClick}
      >
        {/* Save Button - Heart Icon */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full transition-all duration-200 z-10",
            "hover:bg-red-50 hover:scale-110",
            isSaved 
              ? "text-red-500 hover:text-red-600" 
              : "text-gray-400 hover:text-red-500"
          )}
          onClick={handleSaveJob}
          disabled={isSaving}
        >
          <Heart 
            className={cn(
              "h-3 w-3 sm:h-4 sm:w-4 transition-all duration-200",
              isSaved ? "fill-current" : ""
            )} 
          />
        </Button>

        <div className="flex items-start gap-2 sm:gap-3">
          {/* Company Logo */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-subtle flex items-center justify-center shrink-0">
            {logo ? (
              <img src={logo} alt={`${company} logo`} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
            ) : (
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            )}
          </div>
          
          {/* Job Info */}
          <div className="flex-1 min-w-0 pr-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-0.5 sm:mb-1 line-clamp-1">
              {title}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground mb-1.5 sm:mb-2">
              <Building2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
              <span className="text-xs sm:text-sm font-medium line-clamp-1">{company}</span>
            </div>
            
            {/* Details */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground mb-2 sm:mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                <span className="line-clamp-1">{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                <span className="line-clamp-1">{timePosted}</span>
              </div>
            </div>
            
            {/* Deadline */}
            <div className="flex items-center gap-1 mb-2 sm:mb-3">
              <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
              <span className={cn("text-xs font-medium", deadlineColorClass)}>
                {deadline}
              </span>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5 sm:px-2">{type}</Badge>
              {tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className={cn(
                  "text-xs px-1.5 py-0.5 sm:px-2",
                  index > 0 && "hidden sm:flex"
                )}>
                  {tag}
                </Badge>
              ))}
              {tags.length > 1 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 sm:px-2 sm:hidden">
                  +{tags.length - 1}
                </Badge>
              )}
              {tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 sm:px-2 hidden sm:flex">
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};