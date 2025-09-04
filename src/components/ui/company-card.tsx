import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { Building2 } from "lucide-react";

interface CompanyCardProps {
  name: string;
  industry: string;
  openPositions: number;
  logo?: string;
  className?: string;
}

export const CompanyCard = ({ name, industry, openPositions, logo, className }: CompanyCardProps) => {
  return (
    <Card className={`group hover:shadow-card-hover transition-all duration-300 cursor-pointer border-border/50 ${className}`}>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg bg-gradient-subtle flex items-center justify-center shrink-0">
          {logo ? (
            <img src={logo} alt={`${name} logo`} className="w-12 h-12 object-contain" />
          ) : (
            <Building2 className="h-8 w-8 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2 truncate">
            {industry}
          </p>
          <Badge variant="secondary" className="text-xs">
            {openPositions} öppna positioner
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};