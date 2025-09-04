import { Bell, User, Menu, X, ChevronDown, Search, MapPin, Filter } from "lucide-react";
import { Button } from "./button";
import { Logo } from "./logo";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Badge } from "./badge";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderSearchProps {
  searchQuery?: string;
  locationQuery?: string;
  sortBy?: string;
  filterByType?: string;
  onSearchChange?: (query: string) => void;
  onLocationChange?: (location: string) => void;
  onSortChange?: (sort: string) => void;
  onTypeFilterChange?: (type: string) => void;
  jobCount?: number;
}

interface HeaderProps extends HeaderSearchProps {
  isEmployerContext?: boolean;
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

export const Header = ({
  searchQuery = '',
  locationQuery = '',
  sortBy = 'relevance',
  filterByType = 'all',
  onSearchChange,
  onLocationChange,
  onSortChange,
  onTypeFilterChange,
  jobCount,
  isEmployerContext = false
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [localLocationQuery, setLocalLocationQuery] = useState(locationQuery);
  const location = useLocation();
  const { user } = useAuth();

  // Check if we're on jobs page to show search
  const isJobsPage = location.pathname === '/jobs';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange?.(localSearchQuery);
    onLocationChange?.(localLocationQuery);
  };

  // Sync local state with props
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setLocalLocationQuery(locationQuery);
  }, [locationQuery]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide header
        setIsHeaderVisible(false);
      } else {
        // Scrolling up - show header
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navigationItems = isEmployerContext ? [
    { label: "Dashboard", href: "/employers/dashboard" },
    { label: "Jobbannonser", href: "/employers/jobs" },
    { label: "Kandidater", href: "/employers/candidates" },
    { label: "Inställningar", href: "/employers/settings" }
  ] : [
    { label: "Hitta jobb", href: "/jobs" },
    { label: "För arbetsgivare", href: "/companies" },
    { label: "Profil", href: "/profile" }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className={`sticky top-0 z-50 bg-blue-50/90 backdrop-blur-sm border-b border-blue-100/50 transition-transform duration-300 ease-in-out ${
      isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <Logo className="hover:scale-105 transition-transform duration-200" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted/50 ${
                isActive(item.href) 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Context Switch Button - Show "För Jobbsökande" in employer context */}
          {isEmployerContext && (
            <Button variant="outline" size="sm" asChild className="hidden md:flex">
              <Link to="/">För Jobbsökande</Link>
            </Button>
          )}

          {/* Notifications - Only show when logged in */}
          {user && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex relative hover:bg-muted/50"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
          )}

          {/* Auth Buttons - Only show when not logged in */}
          {!user && (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to={isEmployerContext ? "/employers/login" : "/login"}>
                  Logga in
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to={isEmployerContext ? "/employers/register" : "/register"}>
                  {isEmployerContext ? "Registrera företag" : "Registrera"}
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-50/90 border-t border-blue-100/50 animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Context Switch - Show in employer context */}
            {isEmployerContext && (
              <div className="pt-2 border-t border-border/40">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  För Jobbsökande
                </Link>
              </div>
            )}

            {/* Auth section - Only show when not logged in */}
            {!user && (
              <div className="pt-4 border-t border-border/40 space-y-2">
                <Link
                  to={isEmployerContext ? "/employers/login" : "/login"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  Logga in
                </Link>
                <Link
                  to={isEmployerContext ? "/employers/register" : "/register"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isEmployerContext ? "Registrera företag" : "Registrera dig"}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LinkedIn-style Search Section - Only on Jobs Page */}
      {isJobsPage && (
        <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200/50">
          <div className="container mx-auto px-4 py-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Sök jobb, företag..."
                  className="pl-10 h-9 text-sm border-gray-300 focus:border-primary"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                />
              </div>

              {/* Location Input */}
              <div className="relative flex-1 max-w-xs">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Plats..."
                  className="pl-10 h-9 text-sm border-gray-300 focus:border-primary"
                  value={localLocationQuery}
                  onChange={(e) => setLocalLocationQuery(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="hidden lg:flex items-center gap-2">
                <Select value={filterByType} onValueChange={onTypeFilterChange}>
                  <SelectTrigger className="h-9 w-32 text-sm border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-sm">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger className="h-9 w-36 text-sm border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-sm">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button type="submit" size="sm" className="h-9 px-4">
                Sök
              </Button>
            </form>

            {/* Job Count */}
            {jobCount !== undefined && (
              <div className="mt-2 text-sm text-muted-foreground">
                {jobCount} jobb hittades
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};