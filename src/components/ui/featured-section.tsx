import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";

interface FeaturedItem {
  title: string;
  description: string;
  type: "editorial" | "trending" | "new";
  href: string;
  category: string;
}

interface FeaturedSectionProps {
  title: string;
  items: FeaturedItem[];
  icon: React.ReactNode;
}

export const FeaturedSection = ({ title, items, icon }: FeaturedSectionProps) => {
  const getTypeStyle = (type: FeaturedItem["type"]) => {
    switch (type) {
      case "editorial":
        return "bg-primary text-primary-foreground";
      case "trending":
        return "bg-warning text-warning-foreground";
      case "new":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeLabel = (type: FeaturedItem["type"]) => {
    switch (type) {
      case "editorial":
        return "Redaktionellt val";
      case "trending":
        return "Trending";
      case "new":
        return "Nyhet";
      default:
        return "";
    }
  };

  return (
    <section className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-2xl mb-4">
          {icon}
        </div>
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Handplockade guider som hjälper dig att ta nästa steg i din karriär
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <Card key={index} className="group hover:shadow-card-hover transition-all duration-300 border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
                <Badge className={`text-xs ${getTypeStyle(item.type)}`}>
                  {getTypeLabel(item.type)}
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                {item.description}
              </p>
              
              <Link to={item.href}>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Läs mer
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};