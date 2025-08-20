import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-subtle border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-bold text-foreground">JobbPortal</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Sveriges ledande jobbplattform som kopplar samman talangfulla kandidater med innovativa företag.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">För jobbsökare</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Hitta jobb</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">CV-mall</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Karriärguide</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Löneguide</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Jobbalarmer</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">För företag</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Publicera jobb</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Hitta kandidater</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Företagsprofil</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Rekryteringsguide</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Prislista</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 JobbPortal. Alla rättigheter förbehållna.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Integritetspolicy</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Användarvillkor</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};