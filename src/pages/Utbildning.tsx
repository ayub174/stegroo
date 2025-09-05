import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { 
  Search, 
  GraduationCap, 
  Clock, 
  MapPin, 
  Euro, 
  Users, 
  BookOpen, 
  Calendar, 
  Star,
  Heart,
  ArrowRightLeft,
  Filter,
  Grid,
  List,
  TrendingUp,
  Award,
  Building
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data för utbildningar
const mockEducations = [
  {
    id: 1,
    title: "Civilingenjör i Datateknik",
    school: "KTH Royal Institute of Technology",
    level: "Universitet",
    duration: "5 år",
    location: "Stockholm",
    cost: "Ingen avgift",
    rating: 4.5,
    students: 2500,
    description: "Bred utbildning inom datateknik med fokus på både teori och praktik.",
    requirements: ["Matematik 4", "Fysik 2", "Engelska 6"],
    subjects: ["Programmering", "Algoritmer", "Databaser", "AI/ML"],
    careers: ["Mjukvaruingenjör", "Systemarkitekt", "Data Scientist"],
    image: "/api/placeholder/300/200"
  },
  {
    id: 2,
    title: "Ekonomiprogrammet",
    school: "Handelshögskolan i Stockholm",
    level: "Universitet", 
    duration: "3 år",
    location: "Stockholm",
    cost: "Ingen avgift",
    rating: 4.3,
    students: 800,
    description: "Fokus på företagsekonomi, finansiering och strategi.",
    requirements: ["Matematik 3", "Engelska 6", "Samhällskunskap 1b"],
    subjects: ["Redovisning", "Finansiering", "Marknadsföring", "Management"],
    careers: ["Controller", "Finansanalytiker", "Konsult"],
    image: "/api/placeholder/300/200"
  },
  {
    id: 3,
    title: "Webbprogrammerare",
    school: "Nackademin",
    level: "Yrkeshögskola",
    duration: "2 år",
    location: "Stockholm",
    cost: "Ingen avgift", 
    rating: 4.2,
    students: 150,
    description: "Praktisk utbildning inom webbutveckling och modern teknik.",
    requirements: ["Matematik 1", "Engelska 5"],
    subjects: ["HTML/CSS", "JavaScript", "React", "Node.js"],
    careers: ["Frontend Developer", "Fullstack Developer", "UX/UI Designer"],
    image: "/api/placeholder/300/200"
  }
];

const levels = ["Alla", "Gymnasium", "Yrkeshögskola", "Universitet", "Komvux"];
const subjects = ["Teknik", "Ekonomi", "Vård", "Design", "Juridik", "Media"];
const durations = ["Alla", "1 år", "2 år", "3 år", "4+ år"];

export default function Utbildning() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Alla");
  const [selectedSubject, setSelectedSubject] = useState("Alla");
  const [selectedDuration, setSelectedDuration] = useState("Alla");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const toggleCompare = (id: number) => {
    setCompareList(prev => 
      prev.includes(id) 
        ? prev.filter(comp => comp !== id)
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const filteredEducations = mockEducations.filter(edu => {
    const matchesSearch = edu.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         edu.school.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === "Alla" || edu.level === selectedLevel;
    const matchesDuration = selectedDuration === "Alla" || edu.duration.includes(selectedDuration);
    
    return matchesSearch && matchesLevel && matchesDuration;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Hem</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Utbildning</span>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Hitta din <span className="text-primary">perfekta utbildning</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Utforska tusentals utbildningar, jämför alternativ och hitta den utbildning som passar dina mål bäst.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Sök utbildningar, skolor eller ämnen..."
                className="pl-12 pr-4 h-14 text-base rounded-xl border-2 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3 justify-center">
              {levels.slice(1, 4).map(level => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                  className="rounded-full"
                >
                  <GraduationCap className="w-4 h-4 mr-1" />
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Tillgängliga utbildningar</p>
                  <p className="text-2xl font-bold">15,000+</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Registrerade studenter</p>
                  <p className="text-2xl font-bold">450,000+</p>
                </div>
                <Users className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Genomsnittlig matchning</p>
                  <p className="text-2xl font-bold">94%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and View Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex flex-1 gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Nivå" />
              </SelectTrigger>
              <SelectContent>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Längd" />
              </SelectTrigger>
              <SelectContent>
                {durations.map(duration => (
                  <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
            
            {compareList.length > 0 && (
              <Button className="bg-orange-500 hover:bg-orange-600">
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Jämför ({compareList.length})
              </Button>
            )}
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Ämnesområde</h3>
                  <div className="space-y-2">
                    {subjects.map(subject => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox id={subject} />
                        <label htmlFor={subject} className="text-sm">{subject}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Studieform</h3>
                  <div className="space-y-2">
                    {["Campus", "Distans", "Flexibel"].map(form => (
                      <div key={form} className="flex items-center space-x-2">
                        <Checkbox id={form} />
                        <label htmlFor={form} className="text-sm">{form}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Betyg</h3>
                  <div className="space-y-2">
                    {["4.0+", "3.5+", "3.0+"].map(rating => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox id={rating} />
                        <label htmlFor={rating} className="text-sm">{rating} stjärnor</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Kostnad</h3>
                  <div className="space-y-2">
                    {["Gratis", "< 50 000 kr", "< 100 000 kr"].map(cost => (
                      <div key={cost} className="flex items-center space-x-2">
                        <Checkbox id={cost} />
                        <label htmlFor={cost} className="text-sm">{cost}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Visar {filteredEducations.length} utbildningar
          </p>
        </div>

        {/* Education Cards */}
        <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredEducations.map(education => (
            <Card 
              key={education.id} 
              className={`group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 ${
                compareList.includes(education.id) ? "ring-2 ring-orange-400" : ""
              } ${viewMode === "list" ? "flex" : ""}`}
            >
              {viewMode === "grid" ? (
                <>
                  <div className="relative">
                    <img 
                      src={education.image} 
                      alt={education.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="w-8 h-8 rounded-full bg-white/90 hover:bg-white"
                        onClick={() => toggleFavorite(education.id)}
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            favorites.includes(education.id) 
                              ? "text-red-500 fill-red-500" 
                              : "text-gray-600"
                          }`} 
                        />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="w-8 h-8 rounded-full bg-white/90 hover:bg-white"
                        onClick={() => toggleCompare(education.id)}
                        disabled={compareList.length >= 3 && !compareList.includes(education.id)}
                      >
                        <ArrowRightLeft 
                          className={`w-4 h-4 ${
                            compareList.includes(education.id)
                              ? "text-orange-500"
                              : "text-gray-600"
                          }`} 
                        />
                      </Button>
                    </div>
                    <Badge className="absolute top-3 left-3 bg-primary">
                      {education.level}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{education.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{education.students}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {education.title}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-muted-foreground mb-2">
                      <Building className="w-4 h-4" />
                      <span className="text-sm">{education.school}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {education.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{education.duration}</span>
                        <MapPin className="w-4 h-4 text-green-500 ml-2" />
                        <span>{education.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Euro className="w-4 h-4 text-purple-500" />
                        <span>{education.cost}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {education.subjects.slice(0, 3).map(subject => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {education.subjects.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{education.subjects.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <Button className="w-full" asChild>
                      <Link to={`/utbildning/${education.id}`}>
                        Läs mer
                      </Link>
                    </Button>
                  </CardContent>
                </>
              ) : (
                /* List View */
                <div className="flex w-full">
                  <img 
                    src={education.image} 
                    alt={education.title}
                    className="w-48 h-32 object-cover rounded-l-lg flex-shrink-0"
                  />
                  <CardContent className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                          {education.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{education.school}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleFavorite(education.id)}
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              favorites.includes(education.id) 
                                ? "text-red-500 fill-red-500" 
                                : "text-gray-600"
                            }`} 
                          />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleCompare(education.id)}
                        >
                          <ArrowRightLeft 
                            className={`w-4 h-4 ${
                              compareList.includes(education.id)
                                ? "text-orange-500"
                                : "text-gray-600"
                            }`} 
                          />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {education.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{education.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{education.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <span>{education.location}</span>
                      </div>
                      <Badge>{education.level}</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {education.subjects.slice(0, 2).map(subject => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" asChild>
                        <Link to={`/utbildning/${education.id}`}>
                          Läs mer
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Ladda fler utbildningar
          </Button>
        </div>

        {/* Featured Tools Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Verktyg för att hitta rätt utbildning</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Behörighetskalkylator</h3>
              <p className="text-muted-foreground mb-4">
                Kontrollera om du uppfyller kraven för din drömutbildning
              </p>
              <Button variant="outline" className="w-full">
                Testa nu
              </Button>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRightLeft className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Jämförelseverktyg</h3>
              <p className="text-muted-foreground mb-4">
                Jämför utbildningar sida vid sida för att hitta den bästa matchningen
              </p>
              <Button variant="outline" className="w-full">
                Starta jämförelse
              </Button>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Studieplanering</h3>
              <p className="text-muted-foreground mb-4">
                Planera dina studier och få påminnelser om viktiga datum
              </p>
              <Button variant="outline" className="w-full">
                Skapa plan
              </Button>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}