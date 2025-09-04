import { Card, CardContent } from "./card";

interface CategoryCardProps {
  title: string;
  jobCount: number;
  image: string;
  className?: string;
}

export const CategoryCard = ({ title, jobCount, image, className }: CategoryCardProps) => {
  return (
    <Card className={`group hover:shadow-card-hover transition-all duration-300 cursor-pointer border-border/50 overflow-hidden ${className}`}>
      <div className="relative h-32 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {jobCount.toLocaleString('sv-SE')} lediga jobb
        </p>
      </CardContent>
    </Card>
  );
};