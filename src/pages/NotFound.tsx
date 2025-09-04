import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* 404 Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        {/* Blue decorative shapes */}
        <div className="absolute inset-0 z-[1]">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-3xl rotate-12 opacity-60 animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-50 rounded-3xl -rotate-6 opacity-40 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-200 rounded-3xl rotate-3 opacity-50 animate-float" style={{animationDelay: '4s'}}></div>
          
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle, rgb(59 130 246) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* 404 Number */}
            <div className="mb-8 animate-fade-in">
              <div className="text-[150px] lg:text-[200px] font-black text-blue-600 leading-none opacity-20 select-none">
                404
              </div>
            </div>
            
            {/* Main Content */}
            <div className="space-y-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                Sidan kunde inte
                <span className="block text-blue-600">hittas</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Vi kunde inte hitta sidan du letar efter. Den kan ha flyttats, tagits bort eller så skrev du fel adress.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link to="/">
                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl bg-blue-600 hover:bg-blue-700"
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Tillbaka till startsidan
                  </Button>
                </Link>
                
                <Link to="/jobs">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-8 py-4 text-lg font-semibold border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Sök jobb
                  </Button>
                </Link>
              </div>
              
              {/* Help Text */}
              <div className="bg-blue-50 rounded-3xl p-8 border border-blue-200 shadow-lg animate-fade-in" style={{animationDelay: '0.4s'}}>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Behöver du hjälp?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Home className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Startsidan</h4>
                      <p className="text-sm text-gray-600">Gå tillbaka till startsidan och börja om</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Search className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Sök jobb</h4>
                      <p className="text-sm text-gray-600">Hitta lediga jobb som passar dig</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <ArrowLeft className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Gå tillbaka</h4>
                      <p className="text-sm text-gray-600">Använd webbläsarens bakåt-knapp</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default NotFound;