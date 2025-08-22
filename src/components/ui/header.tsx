import { Bell, User, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "./button";
import { Logo } from "./logo";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    { label: "Hitta jobb", href: "/jobs" },
    { label: "Företag", href: "/companies" },
    { label: "Profil", href: "/profile" }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
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
                <Link to="/auth?mode=login">Logga in</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to="/auth">Registrera</Link>
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
        <div className="md:hidden bg-background border-t border-border/40 animate-fade-in">
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
            
            {/* Auth section - Only show when not logged in */}
            {!user && (
              <div className="pt-4 border-t border-border/40 space-y-2">
                <Link
                  to="/auth?mode=login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  Logga in
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Registrera dig
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};