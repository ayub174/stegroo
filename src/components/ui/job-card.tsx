import { MapPin, Clock, Building2, Bookmark } from "lucide-react";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  timePosted: string;
  tags: string[];
  logo?: string;
  className?: string;
}

export const JobCard = ({ 
  title, 
  company, 
  location, 
  salary, 
  type, 
  timePosted, 
  tags,
  logo,
  className 
}: JobCardProps) => {
  return (
    <Card className={`group hover:shadow-card-hover transition-all duration-300 cursor-pointer border-border/50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{company}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{timePosted}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
        
        {salary && (
          <div className="text-primary font-semibold mb-3">
            {salary}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">{type}</Badge>
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          Visa mer
        </Button>
      </CardContent>
    </Card>
  );
};