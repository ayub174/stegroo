import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";

interface EnhancedCategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  topics: string[];
  guideCount: number;
  gradient: string;
  featured?: boolean;
}

export const EnhancedCategoryCard = ({
  title,
  description,
  icon: Icon,
  href,
  topics,
  guideCount,
  gradient,
  featured = false
}: EnhancedCategoryCardProps) => {
  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-card-hover border-border/50 ${
      featured ? 'ring-2 ring-primary/20' : ''
    }`}>
      {/* Gradient top border */}
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
      
      {featured && (
        <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
          Populär
        </Badge>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-button group-hover:scale-105 transition-transform`}>
            <Icon className="w-8 h-8" />
          </div>
        </div>
        
        <CardTitle className="text-2xl group-hover:text-primary transition-colors mb-2">
          {title}
        </CardTitle>
        
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 space-y-6">
        {/* Topics */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Ämnen som täcks:
          </h4>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <Badge 
                key={topic}
                variant="secondary"
                className="text-xs px-3 py-1 bg-muted hover:bg-muted/80"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Guide count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{guideCount} guider tillgängliga</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* CTA Button */}
        <Link to={href} className="block">
          <Button className="w-full group-hover:bg-primary-hover transition-colors shadow-button">
            Utforska {title.toLowerCase()}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};