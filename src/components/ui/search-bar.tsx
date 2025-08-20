import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

interface SearchBarProps {
  className?: string;
}

export const SearchBar = ({ className }: SearchBarProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (locationQuery) params.set('location', locationQuery);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className={`flex flex-col md:flex-row gap-4 w-full max-w-4xl ${className}`}>
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Jobbtitel, företag eller nyckelord"
          className="pl-12 h-12 text-base border-2 focus:border-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex-1 relative">
        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Ort eller region"
          className="pl-12 h-12 text-base border-2 focus:border-primary"
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
        />
      </div>
      <Button type="submit" variant="hero" size="lg" className="h-12 px-8 font-semibold">
        Sök jobb
      </Button>
    </form>
  );
};