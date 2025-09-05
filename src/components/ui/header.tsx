import { Bell, User, Menu, X, ChevronDown, Search, MapPin, Filter, Building2, Users, BookOpen, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "./button";
import { Logo } from "./logo";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
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
  const [contextDropdownOpen, setContextDropdownOpen] = useState(false);

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
    { label: "Jobb", href: "/jobs" }
  ];

  const educationItems = [
    { label: "Gymnasie nivå", href: "/utbildning/gymnasie" },
    { label: "Eftergymnasial nivå", href: "/utbildning/eftergymnasial" },
    { label: "Kortare utbildningar", href: "/utbildning/kortare" }
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
          {/* Regular Navigation Items */}
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted/50 ${
                isActive(item.href) 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label === "Jobb" && <Briefcase className="w-4 h-4 mr-1" />}
              {item.label}
            </Link>
          ))}

          {/* Dropdown Menus - Only for job seekers */}
          {!isEmployerContext && (
            <>
              {/* Guider Link */}
              <Link
                to="/guider"
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted/50 ${
                  isActive('/guider') || location.pathname.startsWith('/guider/')
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <BookOpen className="w-4 h-4 mr-1" />
                Guider
              </Link>

              {/* Utbildning Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-4 py-2 h-auto text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 data-[state=open]:text-primary data-[state=open]:bg-primary/10"
                  >
                    <GraduationCap className="w-4 h-4 mr-1" />
                    Utbildning
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  className="w-48 bg-white/95 backdrop-blur-sm border border-blue-200/60 shadow-lg z-50"
                >
                  {educationItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        to={item.href}
                        className="flex items-center w-full px-3 py-2 text-sm hover:bg-blue-50/80 cursor-pointer"
                      >
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
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

          {/* Auth Buttons and Context Switcher - Only show when not logged in */}
          {!user && (
            <div className="hidden md:flex flex-col items-end gap-2">
              {/* Auth Buttons */}
              <div className="flex items-center gap-2">
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

              {/* Context Switch Dropdown */}
              <DropdownMenu open={contextDropdownOpen} onOpenChange={setContextDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-7 px-3 bg-white/80 backdrop-blur-sm hover:bg-white/90 border-blue-200/60"
                  >
                    {isEmployerContext ? (
                      <>
                        <Building2 className="w-3 h-3 mr-1" />
                        Arbetsgivare
                      </>
                    ) : (
                      <>
                        <Users className="w-3 h-3 mr-1" />
                        Arbetssökande
                      </>
                    )}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-40 bg-white/95 backdrop-blur-sm border border-blue-200/60 shadow-clay-md z-50"
                >
                  {isEmployerContext ? (
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/" 
                        className="flex items-center w-full px-3 py-2 text-sm hover:bg-blue-50/80 cursor-pointer"
                        onClick={() => setContextDropdownOpen(false)}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        För Arbetssökande
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/companies" 
                        className="flex items-center w-full px-3 py-2 text-sm hover:bg-blue-50/80 cursor-pointer"
                        onClick={() => setContextDropdownOpen(false)}
                      >
                        <Building2 className="w-4 h-4 mr-2" />
                        För Arbetsgivare
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
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
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {item.label === "Jobb" && <Briefcase className="w-4 h-4 mr-2" />}
                {item.label}
              </Link>
            ))}

            {/* Mobile Dropdown Menus - Only for job seekers */}
            {!isEmployerContext && (
              <>
                {/* Guider Link */}
                <Link
                  to="/guider"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/guider') || location.pathname.startsWith('/guider/')
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Guider
                </Link>

                {/* Utbildning Section */}
                <div className="pt-2 border-t border-border/40">
                  <div className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Utbildning
                  </div>
                  {educationItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-8 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </>
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
                
                {/* Context Switch for Mobile */}
                <div className="pt-3 border-t border-border/40">
                  <Link
                    to={isEmployerContext ? "/" : "/companies"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  >
                    {isEmployerContext ? (
                      <>
                        <Users className="w-4 h-4 mr-2" />
                        För Arbetssökande
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4 mr-2" />
                        För Arbetsgivare
                      </>
                    )}
                  </Link>
                </div>
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