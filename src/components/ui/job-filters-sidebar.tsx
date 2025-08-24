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
                animation: 'vibrate-periodic 5s infinite'
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
      <div className="w-full bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border border-border/50 rounded-xl">
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="absolute top-2 -right-3 z-10 h-8 w-8 bg-background border-2 border-primary/30 rounded-full shadow-lg hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
        >
          <ChevronLeft className="h-4 w-4 text-primary" />
        </Button>

        <div className="p-3 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Filter & Sök</h3>
            </div>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Rensa
              </Button>
            )}
          </div>

          {/* Compact Search Form */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input 
                  placeholder="Jobbtitel, företag..."
                  className="pl-7 h-8 text-xs"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input 
                  placeholder="Ort eller region"
                  className="pl-7 h-8 text-xs"
                  value={localLocationQuery}
                  onChange={(e) => setLocalLocationQuery(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-7 text-xs">
              Sök jobb
            </Button>
          </form>

          {/* Compact Locations and Type in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Popular Locations */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Populära platser</label>
              <div className="flex flex-wrap gap-1">
                {popularLocations.slice(0, 4).map((location) => (
                  <Badge 
                    key={location}
                    variant={selectedCities.includes(location) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs px-2 py-0.5",
                      selectedCities.includes(location) && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => toggleCity(location)}
                  >
                    {location}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Job Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Anställningstyp</label>
              <Select value={filterByType} onValueChange={onTypeFilterChange}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-xs">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Cities Display */}
          {selectedCities.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Valda: {selectedCities.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};