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
import { LogIn, ArrowRight, Shield, Zap } from "lucide-react";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate("/profile");
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-140px)]">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Welcome back message */}
          <div className="space-y-6 text-center md:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <Shield className="h-4 w-4" />
                Säker inloggning
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Välkommen
                <span className="block bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                  tillbaka!
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Logga in snabbt och säkert för att komma åt dina sparade jobb och fortsätta din karriärresa.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Zap className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="font-medium text-sm">Snabb åtkomst</div>
                  <div className="text-xs text-muted-foreground">Till dina sparade jobb</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Säker data</div>
                  <div className="text-xs text-muted-foreground">Krypterad överföring</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <Card className="shadow-clay-elevated border-border/20 bg-card/90 backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <LogIn className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Logga in
              </CardTitle>
              <CardDescription>
                Välj din inloggningsmetod
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
                  BankID
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
                  Google
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
                  Apple
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
                  className="w-full shadow-button"
                  disabled={isLoading}
                  variant="hero"
                >
                  {isLoading ? "Loggar in..." : "Logga in"}
                  <ArrowRight className="ml-2 h-4 w-4" />
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
                <span className="text-muted-foreground">Inget konto än? </span>
                <Link
                  to="/register"
                  className="text-primary hover:text-primary-hover transition-colors font-medium"
                >
                  Registrera dig här
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}