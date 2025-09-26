import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Emma Lindqvist",
    role: "Frontend Utvecklare",
    company: "Spotify",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    quote: "Hittade mitt drömjobb på bara 2 veckor! Plattformens AI matchade mig perfekt med roller som passade mina färdigheter.",
    timeToJob: "2 veckor",
    salaryIncrease: "+35%",
    previousRole: "Junior Utvecklare"
  },
  {
    id: 2,
    name: "Marcus Andersson",
    role: "UX Designer",
    company: "Klarna",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote: "Fantastisk support genom hela processen. Fick flera jobberbjudanden och kunde välja det som passade bäst.",
    timeToJob: "3 veckor",
    salaryIncrease: "+28%",
    previousRole: "Grafisk Designer"
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Data Analyst",
    company: "Ericsson",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    quote: "Aldrig varit enklare att hitta jobb. Profilmatchningen är otrolig - företagen kontaktade mig direkt!",
    timeToJob: "1 vecka",
    salaryIncrease: "+42%",
    previousRole: "Business Analyst"
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-200 rounded-full opacity-15 animate-float"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-yellow-100 rounded-full opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <Badge variant="secondary" className="font-medium bg-green-50 border-2 border-green-200 px-4 py-2 rounded-2xl shadow-lg">
              <Star className="h-3 w-3 mr-1 text-green-600 fill-green-600" />
              <span className="text-green-700">Framgångsstorior</span>
            </Badge>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Riktiga människor,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
              riktiga resultat
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Se hur våra användare har förvandlat sina karriärer och hittat sina drömjobb genom vår plattform.
          </p>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white transform hover:-translate-y-2"
              style={{
                animationDelay: `${index * 200}ms`
              }}
            >
              <CardContent className="p-8 text-center relative">
                {/* Quote icon */}
                <div className="absolute -top-4 left-8">
                  <div className="bg-blue-600 rounded-full p-3 shadow-lg">
                    <Quote className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                {/* User Image */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-xl group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-white">
                      <Star className="h-4 w-4 text-white fill-white" />
                    </div>
                  </div>
                </div>
                
                {/* Testimonial Quote */}
                <blockquote className="text-gray-700 italic leading-relaxed mb-6 text-lg">
                  "{testimonial.quote}"
                </blockquote>
                
                {/* User Info */}
                <div className="space-y-2 mb-6">
                  <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                  <p className="text-blue-600 font-medium">{testimonial.role}</p>
                  <p className="text-gray-500 text-sm">@ {testimonial.company}</p>
                </div>
                
                {/* Results */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">{testimonial.timeToJob}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Tid till jobb</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{testimonial.salaryIncrease}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Löneökning</div>
                  </div>
                </div>
                
                {/* Before/After */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Från: <span className="font-medium">{testimonial.previousRole}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Statistics Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-blue-100">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">94%</div>
              <div className="text-gray-600 text-sm">Hittar jobb inom 30 dagar</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">+32%</div>
              <div className="text-gray-600 text-sm">Genomsnittlig löneökning</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">150k+</div>
              <div className="text-gray-600 text-sm">Lyckade matchningar</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">4.8★</div>
              <div className="text-gray-600 text-sm">Användarbetyg</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};