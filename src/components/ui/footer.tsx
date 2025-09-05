import { Facebook, Twitter, Linkedin, Instagram, Zap, ArrowUpRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-background via-background/95 to-primary/5 border-t border-primary/10 mt-20 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Stegroo</span>
                <div className="text-xs text-primary font-semibold tracking-wide">KARRIÄRPLATTFORM</div>
              </div>
            </div>
            <p className="text-muted-foreground mb-8 max-w-md text-lg leading-relaxed">
              Nästa generations karriärplattform som accelererar din professionella resa genom AI-driven matchmaking och personliga utvecklingsverktyg.
            </p>
            <div className="flex gap-4">
              <a href="#" className="group p-2 rounded-lg bg-background/50 border border-border/30 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300">
                <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              </a>
              <a href="#" className="group p-2 rounded-lg bg-background/50 border border-border/30 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300">
                <Twitter className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              </a>
              <a href="#" className="group p-2 rounded-lg bg-background/50 border border-border/30 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300">
                <Instagram className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
              Karriärutveckling
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="group text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <span>AI-matchade jobb</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a></li>
              <li><a href="#" className="group text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <span>Kompetensanalys</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a></li>
              <li><a href="#" className="group text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <span>Karriärcoaching</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a></li>
              <li><a href="#" className="group text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <span>Nätverksbyggande</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
              För företag
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="group text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <span>Smart rekrytering</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a></li>
              <li><a href="#" className="group text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <span>Talangpooler</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a></li>
              <li><a href="#" className="group text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <span>Employer branding</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a></li>
              <li><a href="#" className="group text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <span>Analytik & insights</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <p className="text-muted-foreground text-sm">
              © 2024 Stegroo. Alla rättigheter förbehållna.
            </p>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-primary font-medium">Powered by AI</span>
            </div>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Integritet</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Villkor</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};