import { Bell, MapPin, Briefcase, Trash2, Edit3 } from "lucide-react";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";

interface JobAlert {
  id: string;
  title: string;
  location?: string;
  jobType?: string;
  keywords?: string[];
  frequency: 'daily' | 'weekly';
  createdAt: string;
  jobCount: number;
}

interface JobAlertCardProps {
  alert: JobAlert;
  onEdit?: (alert: JobAlert) => void;
  onDelete?: (alertId: string) => void;
}

export const JobAlertCard = ({ alert, onEdit, onDelete }: JobAlertCardProps) => {
  const getFrequencyText = (frequency: string) => {
    return frequency === 'daily' ? 'Dagligen' : 'Veckovis';
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {/* Alert Icon */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center flex-shrink-0">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            
            {/* Alert Details */}
            <div className="space-y-3 flex-1 min-w-0">
              <div>
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {alert.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Skapad {new Date(alert.createdAt).toLocaleDateString('sv-SE')} • {getFrequencyText(alert.frequency)}
                </p>
              </div>
              
              {/* Alert Criteria */}
              <div className="space-y-2">
                {alert.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{alert.location}</span>
                  </div>
                )}
                
                {alert.jobType && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{alert.jobType}</span>
                  </div>
                )}
                
                {alert.keywords && alert.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {alert.keywords.slice(0, 3).map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-1 rounded-full">
                        {keyword}
                      </Badge>
                    ))}
                    {alert.keywords.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-1 rounded-full">
                        +{alert.keywords.length - 3} till
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              {/* Job Count */}
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">
                  {alert.jobCount} nya jobb
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-4">
            {onEdit && (
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onEdit(alert)}
                className="w-8 h-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onDelete(alert.id)}
                className="w-8 h-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};