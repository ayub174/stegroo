import React from "react";
import { Link } from "react-router-dom";
import { Clock, Eye, BookOpen } from "lucide-react";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";

interface PopularGuideCardProps {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  views: number;
  href: string;
  isNew?: boolean;
}

export const PopularGuideCard = ({
  title,
  excerpt,
  category,
  readTime,
  views,
  href,
  isNew = false
}: PopularGuideCardProps) => {
  return (
    <Link to={href}>
      <Card className="group hover:shadow-card-hover transition-all duration-300 border-border/50 h-full">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            {isNew && (
              <Badge className="bg-success text-success-foreground text-xs">
                Ny
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
            
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {excerpt}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{views.toLocaleString('sv-SE')} visningar</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>Guide</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};