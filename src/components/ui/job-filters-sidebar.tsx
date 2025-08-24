import { useState } from "react";
import { Search, MapPin, Filter, X, ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Badge } from "./badge";
import { Separator } from "./separator";
import { CreateJobAlertDialog } from "./create-job-alert-dialog";
import { cn } from "@/lib/utils";

interface JobFiltersSidebarProps {
  searchQuery: string;
  locationQuery: string;
  selectedCities: string[];
  sortBy: string;
  filterByType: string;
  onSearchChange: (query: string) => void;
  onLocationChange: (location: string) => void;
  onSelectedCitiesChange: (cities: string[]) => void;
  onSortChange: (sort: string) => void;
  onTypeFilterChange: (type: string) => void;
  jobCount: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const jobTypes = [
  { value: 'all', label: 'Alla typer' },
  { value: 'Heltid', label: 'Heltid' },
  { value: 'Deltid', label: 'Deltid' },
  { value: 'Konsult', label: 'Konsult' },
  { value: 'Praktik', label: 'Praktik' }
];

const sortOptions = [
  { value: 'relevance', label: 'Relevans' },
  { value: 'newest', label: 'Nyast först' },
  { value: 'salary', label: 'Sista ansökningsdag' }
];

const popularLocations = [
  'Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Västerås', 'Lund', 'Linköping'
];

export const JobFiltersSidebar = ({
  searchQuery,
  locationQuery,
  selectedCities,
  sortBy,
  filterByType,
  onSearchChange,
  onLocationChange,
  onSelectedCitiesChange,
  onSortChange,
  onTypeFilterChange,
  jobCount,
  isCollapsed = false,
  onToggleCollapse
}: JobFiltersSidebarProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [localLocationQuery, setLocalLocationQuery] = useState(locationQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearchQuery);
    onLocationChange(localLocationQuery);
  };

  const clearFilters = () => {
    setLocalSearchQuery('');
    setLocalLocationQuery('');
    onSearchChange('');
    onLocationChange('');
    onSelectedCitiesChange([]);
    onSortChange('relevance');
    onTypeFilterChange('all');
  };

  const toggleCity = (city: string) => {
    const newSelectedCities = selectedCities.includes(city)
      ? selectedCities.filter(c => c !== city)
      : [...selectedCities, city];
    onSelectedCitiesChange(newSelectedCities);
  };

  const hasActiveFilters = searchQuery || locationQuery || selectedCities.length > 0 || sortBy !== 'relevance' || filterByType !== 'all';

  if (isCollapsed) {
    return (
      <div className="relative">
        {/* Collapsed State - Just the toggle button */}
        <div className="w-12 h-full bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border border-border/50 rounded-2xl flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-10 w-10 hover:bg-primary/10 transition-all duration-300"
            style={{
              animation: 'pulse 0.5s ease-in-out infinite alternate, vibrate 5s infinite'
            }}
          >
            <ChevronRight className="h-5 w-5 text-primary" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border border-border/50 rounded-2xl">
        {/* Toggle Button - Positioned on middle right */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="absolute top-8 -right-4 z-10 h-8 w-8 bg-background border border-border/50 rounded-full shadow-sm hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
          style={{
            animation: 'vibrate-slow 7s infinite'
          }}
        >
          <ChevronLeft className="h-4 w-4 text-primary" />
        </Button>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Filter & Sök</h3>
            </div>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Rensa
              </Button>
            )}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sök jobb</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Jobbtitel, företag..."
                  className="pl-10"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Plats</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Ort eller region"
                  className="pl-10"
                  value={localLocationQuery}
                  onChange={(e) => setLocalLocationQuery(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Sök jobb
            </Button>
          </form>

          <Separator />

          {/* Popular Locations */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Populära platser (välj flera)</label>
            <div className="flex flex-wrap gap-2">
              {popularLocations.map((location) => (
                <Badge 
                  key={location}
                  variant={selectedCities.includes(location) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors",
                    selectedCities.includes(location) && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => toggleCity(location)}
                >
                  {location}
                </Badge>
              ))}
            </div>
            {selectedCities.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Valda städer: {selectedCities.join(', ')}
              </div>
            )}
          </div>

          <Separator />

          {/* Job Type Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Anställningstyp</label>
            <Select value={filterByType} onValueChange={onTypeFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Options - REMOVED */}
          
          <Separator />

          {/* Job Alert Section - REMOVED */}

          <Separator />

          {/* Results Count */}
          <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/10">
            <div className="text-2xl font-bold text-primary">{jobCount}</div>
            <div className="text-sm text-muted-foreground">jobb hittades</div>
          </div>
        </div>
      </div>
    </div>
  );
};