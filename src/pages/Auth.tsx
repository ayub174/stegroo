import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [accountType, setAccountType] = useState<"private" | "business">("private");
  const [companyName, setCompanyName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'login') {
      setIsSignUp(false);
    }
  }, [searchParams]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              account_type: accountType,
              company_name: accountType === "business" ? companyName : null,
              display_name: displayName || null
            }
          }
        });
        if (error) throw error;
        toast({
          title: "Registrering lyckades!",
          description: "Kolla din e-post för att bekräfta ditt konto.",
        });
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          navigate("/profile");
        }
    } catch (error: any) {
      toast({
        title: "Fel uppstod",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Fel uppstod",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/profile`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Fel uppstod",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankIDAuth = () => {
    toast({
      title: "BankID",
      description: "BankID-integration kommer snart!",
    });
  };

  const handleTestMode = () => {
    localStorage.setItem('demoAuth', 'true');
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-border/20 bg-card/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent">
                {isSignUp ? "Skapa konto" : "Logga in"}
              </CardTitle>
              <CardDescription>
                {isSignUp 
                  ? "Välj hur du vill registrera dig" 
                  : "Välj hur du vill logga in"
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Social Auth Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleBankIDAuth}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                  </svg>
                  Fortsätt med BankID
                </Button>

                <Button
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full border-border/20 hover:bg-muted/50"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Fortsätt med Google
                </Button>

                <Button
                  onClick={handleAppleAuth}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full border-border/20 hover:bg-muted/50"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Fortsätt med Apple
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Eller</span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/20">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Kontotyp</Label>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="private"
                            name="accountType"
                            value="private"
                            checked={accountType === "private"}
                            onChange={(e) => setAccountType(e.target.value as "private" | "business")}
                            className="text-primary focus:ring-primary"
                          />
                          <Label htmlFor="private" className="cursor-pointer">Privatkonto</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="business"
                            name="accountType"
                            value="business"
                            checked={accountType === "business"}
                            onChange={(e) => setAccountType(e.target.value as "private" | "business")}
                            className="text-primary focus:ring-primary"
                          />
                          <Label htmlFor="business" className="cursor-pointer">Företagskonto</Label>
                        </div>
                      </div>
                    </div>

                    {accountType === "business" && (
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Företagsnamn *</Label>
                        <Input
                          id="companyName"
                          type="text"
                          placeholder="Ditt företag AB"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          required
                          className="border-border/20"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="displayName">Visningsnamn</Label>
                      <Input
                        id="displayName"
                        type="text"
                        placeholder="Ditt namn"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="border-border/20"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">E-post</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="din@epost.se"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-border/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Lösenord</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-border/20"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                  variant="hero"
                >
                  {isLoading ? "Laddar..." : (isSignUp ? "Skapa konto" : "Logga in")}
                </Button>
              </form>

              <Separator className="my-4" />
              
              <Button 
                onClick={handleTestMode}
                variant="outline" 
                className="w-full border-dashed border-accent/50 text-accent hover:bg-accent/10 hover:border-accent"
              >
                🚀 Snabbtest: Gå till profil (demo)
              </Button>

              <div className="text-center text-sm">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary hover:text-primary-hover transition-colors"
                >
                  {isSignUp 
                    ? "Har du redan ett konto? Logga in" 
                    : "Behöver du ett konto? Registrera dig"
                  }
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}