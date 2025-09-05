import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Building2, Lock, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const EmployerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Dummy login logic - replace with real implementation later
    setTimeout(() => {
      toast({
        title: "Inloggning lyckades",
        description: "Välkommen till arbetsgivarportalen!",
      });
      setIsLoading(false);
      // Redirect to employer dashboard later
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header isEmployerContext={true} />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          {/* Back to job seeker link */}
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              För Jobbsökande
            </Link>
          </div>

          <Card className="shadow-clay-lg border-2">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-subtle rounded-2xl flex items-center justify-center shadow-clay-sm">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              
              <CardTitle className="text-2xl font-bold">
                Logga in som arbetsgivare
              </CardTitle>
              <CardDescription>
                Välkommen tillbaka till din rekryteringsportal
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Företagse-post</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="ditt@företag.se"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Lösenord</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full shadow-clay-sm hover:shadow-clay-md transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Loggar in..." : "Logga in"}
                </Button>
                
                <div className="text-center space-y-2">
                  <Link 
                    to="#" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Glömt lösenord?
                  </Link>
                  
                  <div className="text-sm text-muted-foreground">
                    Inget konto ännu?{" "}
                    <Link 
                      to="/employers/register" 
                      className="text-primary hover:underline font-medium"
                    >
                      Registrera företag
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EmployerLogin;