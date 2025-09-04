import { TrendingUp, Users, Briefcase, Star, ArrowRight, Search, UserCheck, Zap, Clock, Shield, Building2, ChevronRight, MapPin as Map } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SearchBar } from "@/components/ui/search-bar";
import { JobCard } from "@/components/ui/job-card";
import { CategoryCard } from "@/components/ui/category-card";
import { CompanyCard } from "@/components/ui/company-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/career-education-hero.jpg";
import techCategoryImage from "@/assets/tech-category.jpg";
import marketingCategoryImage from "@/assets/marketing-category.jpg";
import healthcareCategoryImage from "@/assets/healthcare-category.jpg";
const Index = () => {
  // Rotating words state
  const rotatingWords = ["Arbete", "Nätverk", "Praktik", "Utbildning"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex(prev => (prev + 1) % rotatingWords.length);
        setIsAnimating(false);
      }, 300); // Half of animation duration for smooth transition
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  const featuredJobs = [{
    id: "1",
    title: "Senior Frontend Utvecklare",
    company: "TechCorp AB",
    location: "Stockholm",
    salary: "65 000 - 85 000 kr/mån",
    type: "Heltid",
    timePosted: "2 dagar sedan",
    tags: ["React", "TypeScript", "Remote OK"]
  }, {
    id: "2",
    title: "UX/UI Designer",
    company: "Design Studio",
    location: "Göteborg",
    salary: "55 000 - 70 000 kr/mån",
    type: "Heltid",
    timePosted: "1 dag sedan",
    tags: ["Figma", "Prototyping", "User Research"]
  }, {
    id: "3",
    title: "Produktägare",
    company: "StartupTech",
    location: "Malmö",
    salary: "70 000 - 90 000 kr/mån",
    type: "Heltid",
    timePosted: "3 dagar sedan",
    tags: ["Agile", "Scrum", "Analytics"]
  }, {
    id: "4",
    title: "Backend Developer",
    company: "CloudTech",
    location: "Stockholm",
    salary: "60 000 - 80 000 kr/mån",
    type: "Heltid",
    timePosted: "4 dagar sedan",
    tags: ["Node.js", "MongoDB", "AWS"]
  }, {
    id: "5",
    title: "DevOps Engineer",
    company: "ScaleTech",
    location: "Göteborg",
    salary: "75 000 - 95 000 kr/mån",
    type: "Heltid",
    timePosted: "5 dagar sedan",
    tags: ["Docker", "Kubernetes", "CI/CD"]
  }, {
    id: "6",
    title: "Data Scientist",
    company: "AI Solutions",
    location: "Stockholm",
    salary: "70 000 - 90 000 kr/mån",
    type: "Heltid",
    timePosted: "6 dagar sedan",
    tags: ["Python", "Machine Learning", "SQL"]
  }];
  const categories = [{
    title: "Teknik & IT",
    jobCount: 15240,
    image: techCategoryImage
  }, {
    title: "Marknadsföring",
    jobCount: 8932,
    image: marketingCategoryImage
  }, {
    title: "Hälsovård",
    jobCount: 12456,
    image: healthcareCategoryImage
  }, {
    title: "Ekonomi",
    jobCount: 6789,
    image: techCategoryImage
  }, {
    title: "Utbildning",
    jobCount: 4532,
    image: marketingCategoryImage
  }, {
    title: "Försäljning",
    jobCount: 9876,
    image: healthcareCategoryImage
  }];
  const companies = [{
    name: "Spotify",
    industry: "Musikstreaming",
    openPositions: 23
  }, {
    name: "Klarna",
    industry: "Fintech",
    openPositions: 45
  }, {
    name: "Ericsson",
    industry: "Telekommunikation",
    openPositions: 67
  }, {
    name: "H&M",
    industry: "Mode & Retail",
    openPositions: 34
  }, {
    name: "Volvo Cars",
    industry: "Automotive",
    openPositions: 56
  }, {
    name: "King",
    industry: "Gaming",
    openPositions: 28
  }];
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        {/* Blue accent shapes */}
        <div className="absolute inset-0 z-[1]">
          {/* Blue geometric shapes */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-3xl rotate-12 opacity-60 animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-80 bg-blue-50 rounded-3xl -rotate-6 opacity-40 animate-float" style={{
          animationDelay: '2s'
        }}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-72 bg-blue-200 rounded-3xl rotate-3 opacity-50 animate-float" style={{
          animationDelay: '4s'
        }}></div>
          
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle, rgb(59 130 246) 0.5px, transparent 0.5px)`,
          backgroundSize: '40px 40px'
        }}></div>
        </div>
        
        {/* Hero Image */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full overflow-hidden rounded-3xl mx-4">
            <img src={heroImage} alt="Professional career and education workspace" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[15s] ease-out" />
            {/* Blue-tinted overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/70 to-white/60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-blue-50/30 to-transparent"></div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 pt-12 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Hero Title */}
            <div className="text-center mb-8">
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-[0.9] animate-fade-in" style={{
              animationDelay: '0.2s'
            }}>
                <span className="block mb-2">Karriär</span>
                <span className="block mb-2">Plattformen för</span>
                <span className="relative inline-block group min-h-[1.2em]">
                  <span className={`text-blue-600 block relative transition-all duration-600 ${isAnimating ? 'opacity-0 transform scale-95 translate-y-4' : 'opacity-100 transform scale-100 translate-y-0'}`} key={currentWordIndex}>
                    {rotatingWords[currentWordIndex]}
                    {/* Blue highlight */}
                    <div className="absolute inset-0 bg-blue-200 opacity-20 rounded-xl -skew-x-12 transform scale-105 -z-10"></div>
                  </span>
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto animate-fade-in leading-relaxed font-light" style={{
              animationDelay: '0.4s'
            }}>
                Upptäck tusentals möjligheter från Sveriges ledande företag. 
                <span className="text-blue-600 font-medium"> Vi använder AI för att matcha dig med perfekta roller</span> som passar din profil och ambitioner.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex justify-center mb-12 animate-fade-in" style={{
            animationDelay: '0.6s'
          }}>
              <div className="w-full max-w-2xl relative group">
                <div className="absolute inset-0 bg-white rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 border border-gray-200"></div>
                <SearchBar className="relative transform hover:scale-[1.02] transition-all duration-300 bg-transparent shadow-none border-0" />
              </div>
            </div>
            
            {/* Status Badge - Under search bar */}
            <div className="flex justify-center mb-8 -mt-4 animate-fade-in" style={{
            animationDelay: '0.8s'
          }}>
              <div className="relative group">
                <Badge variant="secondary" className="relative group font-medium text-xs hover:scale-105 transition-all duration-300 cursor-pointer bg-blue-50/90 border border-blue-200/60 hover:border-blue-400 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md backdrop-blur-sm">
                  {/* Blue button effect */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-b-lg"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-2">
                    <div className="p-0.5 bg-blue-500 rounded-md shadow-inner">
                      <TrendingUp className="h-2.5 w-2.5 text-white" />
                    </div>
                    <span className="font-bold text-sm text-blue-600">
                      25,000+
                    </span>
                    <span className="text-gray-600 font-medium text-xs">nya jobb denna vecka</span>
                  </div>
                </Badge>
              </div>
            </div>
            
            {/* Value Propositions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto lg:mx-0 animate-fade-in" style={{
            animationDelay: '0.8s'
          }}>
              {[{
              icon: Clock,
              title: "Hitta jobb snabbt",
              description: "Intelligenta matchningar baserat på dina färdigheter och preferenser",
              color: "from-emerald-500 to-teal-600"
            }, {
              icon: Shield,
              title: "Säkert & pålitligt",
              description: "Verifierade företag och säkra ansökningsprocesser",
              color: "from-blue-500 to-indigo-600"
            }, {
              icon: TrendingUp,
              title: "Utveckla din karriär",
              description: "Verktyg och resurser för att ta nästa steg i din karriär",
              color: "from-purple-500 to-pink-600"
            }].map(({
              icon: Icon,
              title,
              description,
              color
            }, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative p-6 rounded-3xl bg-white border-2 border-gray-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-3">
                      {title}
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
        
        {/* Additional decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      </section>

      {/* Cities Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="secondary" className="font-medium bg-blue-50 border-2 border-blue-200 px-4 py-2 rounded-2xl shadow-lg">
                <Map className="h-3 w-3 mr-1 text-blue-600" />
                <span className="text-gray-700">Populära städer</span>
              </Badge>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
              <span className="text-blue-600">Hitta jobb</span>
              <span className="block text-gray-600 mt-2">i Sveriges största städer</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Utforska karriärmöjligheter i landets mest 
              <span className="text-blue-600 font-medium"> dynamiska arbetsmarknader</span>
            </p>
          </div>
          
          {/* Cities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              {
                name: "Stockholm",
                jobCount: "8,547",
                description: "Huvudstaden erbjuder flest möjligheter",
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
                hoverColor: "hover:border-blue-300"
              },
              {
                name: "Göteborg",
                jobCount: "3,241",
                description: "Västkustens tech- och industricentrum",
                color: "from-emerald-500 to-emerald-600",
                bgColor: "bg-emerald-50",
                hoverColor: "hover:border-emerald-300"
              },
              {
                name: "Malmö",
                jobCount: "2,186",
                description: "Dynamisk Öresundsregion",
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50",
                hoverColor: "hover:border-purple-300"
              },
              {
                name: "Uppsala",
                jobCount: "1,423",
                description: "Universitetsstad med innovation",
                color: "from-orange-500 to-orange-600",
                bgColor: "bg-orange-50",
                hoverColor: "hover:border-orange-300"
              },
              {
                name: "Västerås",
                jobCount: "987",
                description: "Industriell kraft och utveckling",
                color: "from-teal-500 to-teal-600",
                bgColor: "bg-teal-50",
                hoverColor: "hover:border-teal-300"
              }
            ].map((city, index) => (
              <div key={city.name} className="group cursor-pointer" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`relative p-6 rounded-3xl bg-white border-2 border-gray-100 ${city.hoverColor} shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden`}>
                  {/* Background overlay */}
                  <div className={`absolute inset-0 ${city.bgColor} opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500`}></div>
                  
                  {/* Corner decoration */}
                  <div className="absolute top-0 right-0 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                    <div className={`w-full h-full bg-gradient-to-br ${city.color} transform rotate-45 translate-x-8 -translate-y-8`}></div>
                  </div>
                  
                  <div className="relative z-10">
                    {/* City icon */}
                    <div className={`w-14 h-14 bg-gradient-to-r ${city.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Building2 className="h-7 w-7 text-white" />
                    </div>
                    
                    {/* City name */}
                    <div className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                      {city.name}
                    </div>
                    
                    {/* Job count */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${city.color} text-white shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                        <Briefcase className="h-3 w-3" />
                        <span className="font-bold text-sm">{city.jobCount}</span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">lediga jobb</span>
                    </div>
                    
                    {/* Description */}
                    <div className="text-sm text-gray-600 leading-relaxed mb-4">
                      {city.description}
                    </div>
                    
                    {/* Action arrow */}
                    <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                      <span>Utforska jobb</span>
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Call to action */}
          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Button 
              size="lg" 
              variant="outline" 
              className="group hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Map className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Se alla städer
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 overflow-hidden bg-gray-50">
        {/* Blue decorative shapes */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 right-10 w-80 h-80 bg-blue-100 rounded-[4rem] rotate-6 opacity-50 animate-float" style={{
            animationDelay: '1s'
          }}></div>
          <div className="absolute bottom-20 left-20 w-96 h-72 bg-blue-50 rounded-[3rem] -rotate-12 opacity-40 animate-float" style={{
            animationDelay: '3s'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="secondary" className="font-medium bg-blue-50 border-2 border-blue-200 px-4 py-2 rounded-2xl shadow-lg">
                <Zap className="h-3 w-3 mr-1 text-blue-600" />
                <span className="text-gray-700">Så enkelt funkar det</span>
              </Badge>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
              <span className="text-blue-600">3 enkla steg</span>
              <span className="block text-gray-600 mt-2">till ditt drömjobb</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Vår AI-drivna plattform gör det
              <span className="text-blue-600 font-medium"> snabbt och enkelt att hitta rätt jobb</span>
            </p>
          </div>
          
          {/* Steps */}
          <div className="relative z-10 flex items-center gap-4 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="flex-1 group animate-fade-in">
              <div className="relative h-80 w-full perspective-1000">
                <div className="flip-card w-full h-full relative preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
                  {/* Front Face */}
                  <div className="flip-card-front absolute inset-0 backface-hidden rounded-3xl bg-white border-2 border-gray-200 shadow-xl p-8 text-center flex flex-col justify-center overflow-hidden">
                    {/* Diagonal Banner */}
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 transform rotate-45 flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-xl transform -rotate-45 translate-y-2">1</span>
                    </div>
                    
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-blue-100 rounded-2xl">
                        <Search className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900">
                      Sök & Filtrera
                    </h3>
                  </div>
                  
                  {/* Back Face */}
                  <div className="flip-card-back absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-blue-600 text-white shadow-xl p-8 text-center flex flex-col justify-center">
                    <p className="text-lg leading-relaxed">
                      Använd våra smarta filter för att hitta jobb som matchar dina färdigheter, 
                      erfarenhet och önskad plats. Vår AI föreslår relevanta roller baserat på din profil.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Arrow */}
            <div className="hidden lg:block animate-fade-in" style={{animationDelay: '0.2s'}}>
              <ArrowRight className="h-8 w-8 text-blue-400" />
            </div>
            
            {/* Step 2 */}
            <div className="flex-1 group animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="relative h-80 w-full perspective-1000">
                <div className="flip-card w-full h-full relative preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
                  {/* Front Face */}
                  <div className="flip-card-front absolute inset-0 backface-hidden rounded-3xl bg-white border-2 border-gray-200 shadow-xl p-8 text-center flex flex-col justify-center overflow-hidden">
                    {/* Diagonal Banner */}
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 transform rotate-45 flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-xl transform -rotate-45 translate-y-2">2</span>
                    </div>
                    
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-blue-100 rounded-2xl">
                        <UserCheck className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900">
                      Skapa Profil
                    </h3>
                  </div>
                  
                  {/* Back Face */}
                  <div className="flip-card-back absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-blue-600 text-white shadow-xl p-8 text-center flex flex-col justify-center">
                    <p className="text-lg leading-relaxed">
                      Bygg en stark profil med dina färdigheter och arbetserfarenhet. 
                      Skapa en professionell presentation som sticker ut.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Arrow */}
            <div className="hidden lg:block animate-fade-in" style={{animationDelay: '0.4s'}}>
              <ArrowRight className="h-8 w-8 text-blue-400" />
            </div>
            
            {/* Step 3 */}
            <div className="flex-1 group animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="relative h-80 w-full perspective-1000">
                <div className="flip-card w-full h-full relative preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
                  {/* Front Face */}
                  <div className="flip-card-front absolute inset-0 backface-hidden rounded-3xl bg-white border-2 border-gray-200 shadow-xl p-8 text-center flex flex-col justify-center overflow-hidden">
                    {/* Diagonal Banner */}
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-700 to-blue-800 transform rotate-45 flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-xl transform -rotate-45 translate-y-2">3</span>
                    </div>
                    
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-blue-100 rounded-2xl">
                        <Star className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900">
                      Ansök & Få Jobb
                    </h3>
                  </div>
                  
                  {/* Back Face */}
                  <div className="flip-card-back absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-blue-700 text-white shadow-xl p-8 text-center flex flex-col justify-center">
                    <p className="text-lg leading-relaxed">
                      Ansök direkt genom plattformen med ett klick. Få meddelanden om 
                      ansökningsstatus och ta emot jobberbjudanden från intresserade företag.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="text-center mt-16 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-blue-600 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500"></div>
              <Button variant="hero" size="lg" className="relative px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-inner">
                <span className="flex items-center gap-3">
                  Kom igång nu - helt gratis
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Jobs Section */}
      <section className="relative py-20 overflow-hidden bg-white">
        {/* Blue decorative shapes */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 right-10 w-80 h-80 bg-blue-100 rounded-[4rem] rotate-6 opacity-50 animate-float" style={{
          animationDelay: '1s'
        }}></div>
          <div className="absolute bottom-20 left-20 w-96 h-72 bg-blue-50 rounded-[3rem] -rotate-12 opacity-40 animate-float" style={{
          animationDelay: '3s'
        }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="secondary" className="font-medium bg-blue-50 border-2 border-blue-200 px-4 py-2 rounded-2xl shadow-lg">
                <TrendingUp className="h-3 w-3 mr-1 text-blue-600" />
                <span className="text-gray-700">Populärt nu</span>
              </Badge>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
              <span className="text-blue-600">
                Trendande jobb
              </span>
              <span className="block text-gray-600 mt-2">just nu</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              De mest populära jobben som
              <span className="text-blue-600 font-medium"> flest söker efter idag</span>
            </p>
          </div>
          
          {/* Scrolling Jobs Container */}
          <div className="relative">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 shadow-xl">
              <div className="group overflow-hidden" onMouseEnter={e => {
              const scrollContainer = e.currentTarget.querySelector('.scroll-container') as HTMLElement;
              if (scrollContainer) {
                scrollContainer.style.animationPlayState = 'paused';
              }
            }} onMouseLeave={e => {
              const scrollContainer = e.currentTarget.querySelector('.scroll-container') as HTMLElement;
              if (scrollContainer) {
                scrollContainer.style.animationPlayState = 'running';
              }
            }}>
                <div className="scroll-container flex gap-6 animate-scroll-horizontal">
                  {/* Duplicate the jobs array to create seamless loop */}
                  {[...featuredJobs, ...featuredJobs].map((job, index) => <div key={`${job.id}-${index}`} className="flex-shrink-0 w-80 transform hover:scale-[1.02] transition-all duration-300">
                      <JobCard {...job} className="bg-white border border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl rounded-2xl h-full" />
                    </div>)}
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="text-center mt-16 animate-fade-in" style={{
          animationDelay: '0.6s'
        }}>
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-blue-600 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500"></div>
              <Link to="/jobs">
                <Button variant="hero" size="lg" className="relative px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-inner">
                  <span className="flex items-center gap-3">
                    Utforska alla jobb
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex justify-center items-center gap-8 mt-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-lg"></div>
                <span>Nya jobb varje dag</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-lg"></div>
                <span>AI-matchade rekommendationer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Företag som rekryterar
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Anslut dig till Sveriges mest innovativa företag
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, index) => <CompanyCard key={index} {...company} className="animate-fade-in shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-gray-200 hover:border-blue-300 rounded-3xl" />)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-700 overflow-hidden">
        {/* Blue decorative shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-400/30 rounded-[4rem] rotate-12 animate-float opacity-40"></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-64 bg-blue-500/20 rounded-[3rem] -rotate-6 animate-float opacity-50" style={{
          animationDelay: '2s'
        }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 drop-shadow-lg">
            Redo att ta nästa steg?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto drop-shadow">
            Gå med i miljontals jobbsökare som redan hittat sin drömkarriär genom vår plattform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="font-semibold bg-white text-blue-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl border-0 rounded-2xl">
              Skapa profil
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur bg-white/5 rounded-2xl shadow-lg">
              För företag
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;
