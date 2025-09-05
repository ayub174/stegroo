import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Building2, Lock, Mail, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const EmployerRegister = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Fel",
        description: "Lösenorden matchar inte",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Dummy registration logic - replace with real implementation later
    setTimeout(() => {
      toast({
        title: "Registrering lyckades",
        description: "Välkommen till Stegroo! Kontrollera din e-post för bekräftelse.",
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                Registrera företag
              </CardTitle>
              <CardDescription>
                Skapa ett konto för att börja rekrytera
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Företagsnamn</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Ditt företag AB"
                      className="pl-10"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactName">Kontaktperson</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactName"
                      type="text"
                      placeholder="Ditt namn"
                      className="pl-10"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Företagse-post</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="ditt@företag.se"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
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
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full shadow-clay-sm hover:shadow-clay-md transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Registrerar..." : "Registrera företag"}
                </Button>
                
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Har redan ett konto?{" "}
                    <Link 
                      to="/employers/login" 
                      className="text-primary hover:underline font-medium"
                    >
                      Logga in här
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

export default EmployerRegister;