import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { UserPlus, Sparkles, Gift, Users, CheckCircle } from "lucide-react";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const accountType = "private"; // Fast inställd för arbetssökande
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            account_type: "private",
            display_name: displayName || null
          }
        }
      });
      if (error) throw error;
      toast({
        title: "Välkommen ombord! 🎉",
        description: "Kolla din e-post för att bekräfta ditt konto.",
      });
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

  const benefits = [
    { 
      icon: Sparkles, 
      title: "AI-driven matchning", 
      text: "Få jobbförslag som matchar din profil och dina intressen automatiskt" 
    },
    { 
      icon: Gift, 
      title: "Spara & organisera", 
      text: "Samla alla intressanta jobb på ett ställe och skapa en strukturerad jobbsökning" 
    },
    { 
      icon: CheckCircle, 
      title: "Ansökningsöversikt", 
      text: "Håll koll på alla dina ansökningar och få påminnelser om uppföljningar" 
    },
    { 
      icon: Users, 
      title: "Intelligenta notiser", 
      text: "Bli först med att veta när ditt drömjobb blir tillgängligt - direkt i din mejl" 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/5 via-background to-primary/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-gradient-shift opacity-50"></div>
      <div className="absolute top-20 left-10 w-20 h-20 bg-success/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-success/10 to-primary/10 text-foreground rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Helt gratis att komma igång
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4">
              Hitta ditt nästa
              <span className="block bg-gradient-to-r from-success via-primary to-primary-hover bg-clip-text text-transparent">
                drömjobb!
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Gå med idag och få tillgång till tusentals jobb, smarta AI-matchningar och personliga notifieringar – helt gratis!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left side - Benefits */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Varför skapa ett konto?</h2>
                <div className="grid gap-4">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-5 bg-card/60 backdrop-blur-sm rounded-lg border border-border/20 hover:shadow-clay-base transition-all duration-200 animate-fade-in"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="p-2 bg-gradient-to-br from-success/10 to-primary/10 rounded-lg flex-shrink-0">
                        <benefit.icon className="h-5 w-5 text-success" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-foreground font-semibold">{benefit.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{benefit.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-r from-primary/5 to-success/5 rounded-xl border border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Över 50 000+ nöjda användare</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        "Tack vare plattformen hittade jag mitt drömjobb på bara 2 veckor! AI-matchningen sparade mig timmar av letande." 
                        <span className="block mt-1 font-medium text-foreground">- Maria, Stockholm</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-card/60 backdrop-blur-sm rounded-lg border border-border/20 text-center">
                    <div className="text-2xl font-bold text-success mb-1">15 000+</div>
                    <div className="text-xs text-muted-foreground">Nya jobb/månad</div>
                  </div>
                  <div className="p-4 bg-card/60 backdrop-blur-sm rounded-lg border border-border/20 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">94%</div>
                    <div className="text-xs text-muted-foreground">Nöjda användare</div>
                  </div>
                  <div className="p-4 bg-card/60 backdrop-blur-sm rounded-lg border border-border/20 text-center">
                    <div className="text-2xl font-bold text-success mb-1">2.5 v</div>
                    <div className="text-xs text-muted-foreground">Snitt till jobb</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Registration form */}
            <Card className="shadow-clay-elevated border-border/20 bg-card/90 backdrop-blur-xl">
              <CardHeader className="space-y-1 text-center pb-6">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-success/20 to-primary/20 rounded-full flex items-center justify-center mb-2">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                  Skapa ditt konto
                </CardTitle>
                <CardDescription>
                  Välj hur du vill registrera dig
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Social Auth Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleBankIDAuth}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-button"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                      <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                    </svg>
                    Skapa konto med BankID
                  </Button>

                  <Button
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full border-border/20 hover:bg-muted/50 hover:shadow-clay-base transition-all duration-200"
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
                    className="w-full border-border/20 hover:bg-muted/50 hover:shadow-clay-base transition-all duration-200"
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
                    <span className="bg-card px-2 text-muted-foreground">Eller med e-post</span>
                  </div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Ditt namn (valfritt)</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="T.ex. Anna Andersson"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="border-border/20 focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">E-post</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="din@epost.se"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-border/20 focus:border-primary/50 transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Lösenord</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-border/20 focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-success to-success/90 hover:from-success/90 hover:to-success text-success-foreground shadow-button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Skapar konto..." : "Skapa mitt konto"}
                    <Sparkles className="ml-2 h-4 w-4" />
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

                <div className="text-center text-sm pt-2">
                  <span className="text-muted-foreground">Har du redan ett konto? </span>
                  <Link
                    to="/login"
                    className="text-primary hover:text-primary-hover transition-colors font-medium"
                  >
                    Logga in här
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}