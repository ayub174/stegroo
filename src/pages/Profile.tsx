import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SavedJobsSection } from "@/components/ui/saved-jobs-section";
import { JobAlertsSection } from "@/components/ui/job-alerts-section";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  FileText, 
  Settings, 
  LogOut,
  Building,
  Calendar,
  Star,
  Download,
  Upload,
  Edit3,
  Save,
  BookmarkIcon,
  ChevronLeft,
  ChevronRight,
  Building2,
  ExternalLink,
  Trash2,
  BarChart3,
  TrendingUp,
  Target,
  Zap,
  Clock,
  BookOpen,
  Award
} from "lucide-react";

type Profile = {
  id: string;
  user_id: string;
  account_type: 'private' | 'business' | 'admin';
  company_name?: string;
  display_name?: string;
  created_at: string;
  updated_at: string;
};

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [activeSection, setActiveSection] = useState<'saved-jobs' | 'applications' | 'statistics' | null>(null);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSavedJobs, setTotalSavedJobs] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isDemoMode = localStorage.getItem('demoAuth') === 'true';
      
      if (!session && !isDemoMode) {
        navigate("/auth");
        return;
      }
      
      if (session) {
        setUser(session.user);
        
        // Fetch profile
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(profileData);
          setDisplayName(profileData.display_name || "");
        }
      } else if (isDemoMode) {
        // Demo mode - set mock user
        setUser({ email: 'demo@example.com', id: 'demo-user' });
        setProfile({
          id: 'demo-profile',
          user_id: 'demo-user',
          account_type: 'private',
          display_name: 'Demo Användare',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        setDisplayName('Demo Användare');
      }
      
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isDemoMode = localStorage.getItem('demoAuth') === 'true';
      if (!session && !isDemoMode) {
        navigate("/auth");
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const isDemoMode = localStorage.getItem('demoAuth') === 'true';
    if (isDemoMode) {
      localStorage.removeItem('demoAuth');
    } else {
      await supabase.auth.signOut();
    }
    navigate("/");
  };

  const exitTestMode = () => {
    localStorage.removeItem('demoAuth');
    navigate("/");
  };

  const fetchSavedJobs = async (page = 1) => {
    if (!user) return;
    
    try {
      const itemsPerPage = 10;
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error, count } = await supabase
        .from('saved_jobs')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      setSavedJobs(data || []);
      setTotalSavedJobs(count || 0);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      toast({
        title: "Fel",
        description: "Kunde inte hämta sparade jobb.",
        variant: "destructive",
      });
    }
  };

  const handleCardClick = (section: 'saved-jobs' | 'applications' | 'statistics') => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
      if (section === 'saved-jobs') {
        fetchSavedJobs(1);
        setCurrentPage(1);
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
      })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Fel",
        description: "Kunde inte spara profilen",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sparat!",
        description: "Din profil har uppdaterats",
      });
      setEditing(false);
      // Refresh profile
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const mockJobs = [
    { id: 1, title: "Frontend Developer", company: "Tech AB", location: "Stockholm", saved: true },
    { id: 2, title: "UX Designer", company: "Design Studio", location: "Göteborg", saved: true },
    { id: 3, title: "Full Stack Developer", company: "Startup Inc", location: "Malmö", saved: false },
  ];

  const mockApplications = [
    { id: 1, title: "Senior Developer", company: "BigTech AB", status: "Under granskning", date: "2024-01-15" },
    { id: 2, title: "Product Manager", company: "Innovation Co", status: "Intervju bokad", date: "2024-01-10" },
  ];

  const isDemoMode = localStorage.getItem('demoAuth') === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-muted/20 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute top-1/2 right-20 w-96 h-96 bg-accent/8 rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-primary/6 rounded-full blur-3xl animate-pulse opacity-50" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <Header />
      
      {isDemoMode && (
        <div className="relative bg-gradient-to-r from-accent/15 via-primary/10 to-accent/15 backdrop-blur-sm border-b border-accent/20 shadow-inner">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between text-sm bg-background/30 rounded-2xl px-4 py-3 shadow-inner border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center animate-pulse">
                  <span className="text-white text-sm">🚀</span>
                </div>
                <span className="font-medium">Du är i testläge - ingen inloggning krävs</span>
              </div>
              <Button 
                onClick={exitTestMode} 
                className="h-8 px-4 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 hover:from-accent/30 hover:to-primary/30 border-0 shadow-inner hover:shadow-lg transition-all duration-300 hover-scale"
                size="sm"
              >
                Avsluta testläge
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          {/* Claymorphism Profile Header */}
          <div className="relative">
            <Card className="border-0 bg-gradient-to-br from-clay-light via-clay-base to-clay-light rounded-3xl shadow-clay-elevated hover:shadow-clay-pressed transition-all duration-300 overflow-hidden">
              <CardContent className="p-8 bg-gradient-to-br from-white/80 via-gray-50/90 to-white/80 shadow-inner rounded-3xl">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  <div className="relative shrink-0">
                    <Avatar className="w-24 h-24 rounded-2xl border-2 border-gray-200 shadow-clay-inset bg-gradient-to-br from-gray-100 to-white hover:shadow-clay-pressed transition-all duration-300">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary via-primary-hover to-accent text-white rounded-2xl shadow-inner">
                        {displayName ? displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      size="sm" 
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-white border-2 border-gray-200 shadow-clay-base hover:shadow-clay-pressed text-gray-700 hover:text-primary transition-all duration-300"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-3">
                        {editing ? (
                          <Input
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Ditt namn"
                            className="text-2xl font-bold bg-background/50 border-0 rounded-xl px-4 py-3 transition-all duration-300"
                          />
                        ) : (
                          <div className="relative">
                            <h1 className="text-3xl font-bold text-gray-800 px-6 py-4 rounded-2xl bg-gradient-to-br from-white/90 via-gray-50/80 to-white/90 border-2 border-gray-200/60 shadow-clay-inset backdrop-blur-sm relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-2xl"></div>
                              <span className="relative z-10 text-primary font-bold">
                                {displayName || "Ange ditt namn"}
                              </span>
                            </h1>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-white/90 border-2 border-gray-200 shadow-clay-inset w-fit">
                          <Mail className="h-4 w-4 text-primary" />
                          <span className="text-gray-700 text-sm font-medium">{user?.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="px-4 py-2 rounded-full bg-white border-2 border-gray-200 shadow-clay-base text-gray-700 font-medium">
                            {profile?.account_type === 'business' ? 'Företag' : 'Privatperson'}
                          </Badge>
                          {profile?.company_name && (
                            <Badge className="px-4 py-2 rounded-full bg-white border-2 border-gray-200 shadow-clay-base text-gray-700 font-medium flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {profile.company_name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-3 flex-shrink-0">
                        {editing ? (
                          <>
                            <Button 
                              onClick={handleSaveProfile} 
                              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-white border-2 border-primary/20 shadow-clay-elevated hover:shadow-clay-pressed font-semibold transition-all duration-300"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Spara
                            </Button>
                            <Button 
                              onClick={() => setEditing(false)}
                              className="px-6 py-3 rounded-2xl bg-white border-2 border-gray-300 shadow-clay-base hover:shadow-clay-pressed text-gray-700 font-semibold transition-all duration-300"
                            >
                              Avbryt
                            </Button>
                          </>
                        ) : (
                          <Button 
                            onClick={() => setEditing(true)} 
                            className="px-6 py-3 rounded-2xl bg-white border-2 border-gray-300 shadow-clay-base hover:shadow-clay-pressed text-gray-700 hover:text-white hover:bg-primary font-semibold transition-all duration-300"
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Redigera
                          </Button>
                        )}
                          <Button 
                            onClick={handleSignOut}
                            className="px-6 py-3 rounded-2xl bg-red-50 border-2 border-red-200 shadow-clay-base hover:shadow-clay-pressed text-red-600 hover:text-white hover:bg-red-600 font-semibold transition-all duration-300"
                          >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logga ut
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Improved Layout with Responsive Design */}
          <div className="relative">
            <Tabs defaultValue="personal" className="flex flex-col lg:flex-row gap-6">
              {/* Horizontal Tabs for Mobile, Vertical for Desktop */}
              <div className="lg:w-72 shrink-0">
                <TabsList className="w-full h-auto p-1 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl border border-white/10 rounded-2xl flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
                  {[
                    { value: "personal", label: "Rekommenderade jobb", icon: "🎯", description: "Jobbrekommendationer för dig" },
                    { value: "overview", label: "Översikt", icon: "📊", description: "Din dashboard" },
                    { value: "jobs", label: "Sparade jobb", icon: "💼", description: "Favoriter" },
                    { value: "alerts", label: "Jobbevakningar", icon: "🔔", description: "Bevaka nya jobb" },
                    { value: "applications", label: "Ansökningar", icon: "📋", description: "Status" },
                    { value: "cv", label: "CV & Profil", icon: "🎓", description: "Hantera CV" },
                    { value: "settings", label: "Inställningar", icon: "⚙️", description: "Systeminställningar" }
                  ].map((tab) => (
                    <TabsTrigger 
                      key={tab.value}
                      value={tab.value} 
                      className="flex-shrink-0 lg:w-full flex items-center gap-3 h-12 lg:h-16 px-4 lg:px-6 rounded-xl bg-transparent hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/15 data-[state=active]:to-accent/15 data-[state=active]:shadow-inner border-0 transition-all duration-300 hover-scale group/tab justify-start text-left"
                    >
                      <span className="text-xl flex-shrink-0">{tab.icon}</span>
                      <div className="hidden lg:block">
                        <div className="font-medium text-sm">{tab.label}</div>
                        <div className="text-xs text-muted-foreground opacity-80">{tab.description}</div>
                      </div>
                      <span className="lg:hidden text-xs font-medium">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {/* Content Area with Better Spacing */}
              <div className="flex-1 min-w-0">

              <TabsContent value="personal" className="space-y-6 animate-fade-in">
                <div className="space-y-6">
                  {/* Header with AI recommendation status */}
                  <Card className="border-0 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Target className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-primary mb-2">Rekommenderade jobb för dig</h2>
                          <p className="text-muted-foreground mb-3">
                            Vi har analyserat din profil och hittat {12} jobb som passar dina färdigheter och erfarenheter.
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700">
                              <Zap className="h-3 w-3" />
                              <span>AI-driven matchning</span>
                            </div>
                            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                              <Clock className="h-3 w-3" />
                              <span>Uppdaterad för 2 timmar sedan</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendation filters */}
                  <Card className="border-0 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl rounded-2xl shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Filtrera rekommendationer</h3>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Anpassa AI-matchning
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { label: "Alla", active: true },
                          { label: "90%+ matchning", active: false },
                          { label: "Remote", active: false },
                          { label: "Stockholm", active: false },
                          { label: "Senior nivå", active: false }
                        ].map((filter) => (
                          <Button
                            key={filter.label}
                            size="sm"
                            variant={filter.active ? "default" : "outline"}
                            className="rounded-full"
                          >
                            {filter.label}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommended jobs list */}
                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        title: "Senior Frontend Developer",
                        company: "TechNova AB",
                        location: "Stockholm (Remote möjligt)",
                        match: 95,
                        salary: "65,000 - 80,000 SEK",
                        tags: ["React", "TypeScript", "Node.js"],
                        posted: "2 dagar sedan",
                        why: "Perfekt matchning för dina React och TypeScript-färdigheter",
                        logo: null,
                        urgent: true
                      },
                      {
                        id: 2,
                        title: "Full Stack Developer",
                        company: "StartupHub",
                        location: "Göteborg",
                        match: 88,
                        salary: "55,000 - 70,000 SEK",
                        tags: ["JavaScript", "Python", "AWS"],
                        posted: "1 dag sedan",
                        why: "Dina fullstack-kunskaper och molnexpertis passar utmärkt",
                        logo: null,
                        urgent: false
                      },
                      {
                        id: 3,
                        title: "Lead Developer",
                        company: "FinTech Solutions",
                        location: "Stockholm",
                        match: 82,
                        salary: "75,000 - 95,000 SEK",
                        tags: ["Team Lead", "Architecture", "React"],
                        posted: "3 dagar sedan",
                        why: "Din ledarskapsexpertis och tekniska bakgrund är idealisk",
                        logo: null,
                        urgent: false
                      }
                    ].map((job) => (
                      <Card key={job.id} className="border-0 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-scale overflow-hidden group">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 border border-border shadow-sm">
                                {job.logo ? (
                                  <img src={job.logo} alt={`${job.company} logo`} className="w-8 h-8 object-contain" />
                                ) : (
                                  <Building2 className="h-6 w-6 text-muted-foreground" />
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-lg text-foreground">
                                    {job.title}
                                  </h4>
                                  {job.urgent && (
                                    <Badge className="bg-red-100 text-red-700 border-red-200 animate-pulse">
                                      Brådskande
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                  <div className="flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    <span>{job.company}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{job.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{job.posted}</span>
                                  </div>
                                </div>

                                {/* AI recommendation explanation */}
                                <div className="mb-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Zap className="h-3 w-3 text-primary" />
                                    <span className="text-xs font-medium text-primary">AI-matchning: {job.match}%</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{job.why}</p>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {job.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>

                                <div className="text-sm font-medium text-primary">
                                  {job.salary} / månad
                                </div>
                              </div>
                            </div>

                            {/* Match percentage circle */}
                            <div className="flex flex-col items-center gap-2 ml-4">
                              <div className="relative w-16 h-16">
                                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                  <path
                                    className="text-muted stroke-current"
                                    strokeWidth="3"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  />
                                  <path
                                    className={`stroke-current ${
                                      job.match >= 90 ? 'text-green-500' : job.match >= 80 ? 'text-blue-500' : 'text-amber-500'
                                    }`}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    fill="none"
                                    strokeDasharray={`${job.match}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-sm font-bold text-foreground">{job.match}%</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Visa annons
                              </Button>
                              <Button size="sm" variant="outline">
                                <Heart className="h-3 w-3 mr-1" />
                                Spara
                              </Button>
                            </div>
                            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                              <span className="text-xs">Inte intresserad</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Load more */}
                  <div className="text-center">
                    <Button variant="outline" size="lg" className="px-8">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Visa fler rekommendationer
                    </Button>
                  </div>

                  {/* Improvement suggestions */}
                  <Card className="border-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50 backdrop-blur-xl rounded-2xl shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                          <Award className="h-5 w-5 text-amber-600" />
                        </div>
                        <h3 className="font-semibold text-lg">Förbättra dina matchningar</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Komplettera din profil för att få ännu bättre jobbmatchningar
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <span className="text-sm">Lägg till fler färdigheter i din profil</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <span className="text-sm">Ladda upp ditt CV för bättre analys</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="overview" className="space-y-6 animate-fade-in">
                {/* Quick Stats with Better Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { 
                      title: "Sparade jobb", 
                      icon: Heart, 
                      value: totalSavedJobs || mockJobs.filter(j => j.saved).length, 
                      description: "favoriter",
                      color: "from-rose-500/20 to-pink-500/10",
                      iconColor: "text-rose-600",
                      clickable: true,
                      section: 'saved-jobs' as const
                    },
                    { 
                      title: "Ansökningar", 
                      icon: FileText, 
                      value: mockApplications.length, 
                      description: "pågående",
                      color: "from-blue-500/20 to-indigo-500/10",
                      iconColor: "text-blue-600",
                      clickable: true,
                      section: 'applications' as const
                    },
                    { 
                      title: "Statistik", 
                      icon: BarChart3, 
                      value: "Visa", 
                      description: "detaljer",
                      color: "from-amber-500/20 to-yellow-500/10",
                      iconColor: "text-amber-600",
                      clickable: true,
                      section: 'statistics' as const
                    }
                  ].map((stat, index) => (
                    <Card 
                      key={stat.title} 
                      className={`border-0 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                        stat.clickable ? 'cursor-pointer hover-scale' : ''
                      } ${
                        activeSection === stat.section ? 'ring-2 ring-primary/50' : ''
                      }`}
                      onClick={() => stat.clickable && stat.section && handleCardClick(stat.section)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                            <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-foreground">
                              {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {stat.title.toLowerCase()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recent Activity */}
                <Card className="border-0 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl rounded-2xl shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <span className="text-lg">📈</span>
                      </div>
                      Senaste aktivitet
                    </CardTitle>
                    <CardDescription>Dina senaste handlingar på plattformen</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { icon: Heart, title: "Sparade jobb: Frontend Developer", subtitle: "Tech AB - för 2 dagar sedan", color: "text-rose-600" },
                      { icon: FileText, title: "Skickade ansökan: Product Manager", subtitle: "Innovation Co - för 5 dagar sedan", color: "text-blue-600" }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-background/60 to-background/40 border border-white/10 hover:border-white/20 transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-background/80 to-background/60 flex items-center justify-center">
                          <activity.icon className={`h-5 w-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                 </Card>

                {/* Detailed Section */}
                {activeSection && (
                  <Card className="border-0 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl rounded-2xl shadow-lg animate-fade-in">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          {activeSection === 'saved-jobs' ? (
                            <Heart className="h-5 w-5 text-rose-600" />
                          ) : activeSection === 'applications' ? (
                            <FileText className="h-5 w-5 text-blue-600" />
                          ) : (
                            <BarChart3 className="h-5 w-5 text-amber-600" />
                          )}
                        </div>
                        {activeSection === 'saved-jobs' ? 'Sparade jobb' : activeSection === 'applications' ? 'Ansökningar' : 'Statistik'}
                      </CardTitle>
                      <CardDescription>
                        {activeSection === 'saved-jobs' 
                          ? 'Alla dina sparade jobb' 
                          : activeSection === 'applications'
                          ? 'Status på alla dina jobbansökningar'
                          : 'Din jobbsökningsstatistik och kategorier'
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {activeSection === 'saved-jobs' ? (
                        <div className="space-y-4">
                          {savedJobs.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-muted-foreground mb-4">Du har inga sparade jobb än.</p>
                              <Button asChild>
                                <a href="/jobs">Börja söka jobb</a>
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="space-y-3">
                                {savedJobs.map((job) => (
                                  <div key={job.id} className="p-4 bg-background/40 rounded-xl border border-white/10 group hover:bg-background/60 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                      <div className="flex items-start gap-3 flex-1">
                                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 border border-border">
                                          {job.logo ? (
                                            <img src={job.logo} alt={`${job.company} logo`} className="w-6 h-6 object-contain" />
                                          ) : (
                                            <Building2 className="h-5 w-5 text-muted-foreground" />
                                          )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-medium text-foreground mb-1 truncate">
                                            {job.job_title}
                                          </h4>
                                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                            <div className="flex items-center gap-1">
                                              <Building2 className="h-3 w-3" />
                                              <span className="truncate">{job.company}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <MapPin className="h-3 w-3" />
                                              <span className="truncate">{job.location}</span>
                                            </div>
                                            {job.deadline && (
                                              <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span className="truncate">Ansök senast {job.deadline}</span>
                                              </div>
                                            )}
                                          </div>
                                          
                                          <div className="flex flex-wrap gap-2">
                                            {job.type && <Badge variant="secondary" className="text-xs">{job.type}</Badge>}
                                            {job.tags?.slice(0, 2).map((tag: string, index: number) => (
                                              <Badge key={index} variant="outline" className="text-xs">
                                                {tag}
                                              </Badge>
                                            ))}
                                            {job.tags && job.tags.length > 2 && (
                                              <Badge variant="outline" className="text-xs">
                                                +{job.tags.length - 2} mer
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 ml-4">
                                        <Button size="sm" asChild>
                                          <a href={`/job/${job.job_id}`} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-3 w-3 mr-1" />
                                            Visa
                                          </a>
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={async () => {
                                            const { error } = await supabase
                                              .from('saved_jobs')
                                              .delete()
                                              .eq('id', job.id);
                                            if (!error) {
                                              fetchSavedJobs(currentPage);
                                              toast({
                                                title: "Jobbet har tagits bort",
                                                description: "Jobbet har tagits bort från dina sparade jobb.",
                                              });
                                            }
                                          }}
                                          className="text-muted-foreground hover:text-destructive"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    <p className="text-xs text-muted-foreground">
                                      Sparad: {new Date(job.created_at).toLocaleDateString('sv-SE')}
                                    </p>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Pagination */}
                              {totalSavedJobs > 10 && (
                                <div className="flex justify-between items-center pt-4">
                                  <p className="text-sm text-muted-foreground">
                                    Visar {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalSavedJobs)} av {totalSavedJobs} jobb
                                  </p>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        const newPage = currentPage - 1;
                                        setCurrentPage(newPage);
                                        fetchSavedJobs(newPage);
                                      }}
                                      disabled={currentPage === 1}
                                    >
                                      <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        const newPage = currentPage + 1;
                                        setCurrentPage(newPage);
                                        fetchSavedJobs(newPage);
                                      }}
                                      disabled={currentPage * 10 >= totalSavedJobs}
                                    >
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ) : activeSection === 'applications' ? (
                        // Applications section
                        <div className="space-y-4">
                          {mockApplications.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-muted-foreground mb-4">Du har inga ansökningar än.</p>
                              <Button asChild>
                                <a href="/jobs">Börja söka jobb</a>
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {mockApplications.map((app) => (
                                <div key={app.id} className="p-4 bg-background/40 rounded-xl border border-white/10">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h4 className="font-medium text-foreground mb-1">
                                        {app.title}
                                      </h4>
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Building2 className="h-3 w-3" />
                                        <span>{app.company}</span>
                                      </div>
                                    </div>
                                    <Badge 
                                      className={
                                        app.status === 'Intervju bokad' 
                                          ? 'bg-green-100 text-green-800 border-green-200' 
                                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                      }
                                    >
                                      {app.status}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Ansökt: {new Date(app.date).toLocaleDateString('sv-SE')}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : activeSection === 'statistics' ? (
                        // Statistics section
                        <div className="space-y-6">
                          {/* Overall Statistics */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-background/40 rounded-xl border border-white/10">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-foreground">
                                    {mockApplications.length}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Totala ansökningar
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 bg-background/40 rounded-xl border border-white/10">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                  <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-foreground">
                                    {mockApplications.filter(app => app.status === 'Intervju bokad').length}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Intervjuer
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 bg-background/40 rounded-xl border border-white/10">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                                  <Heart className="h-5 w-5 text-rose-600" />
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-foreground">
                                    {totalSavedJobs || mockJobs.filter(j => j.saved).length}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Sparade jobb
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Job Categories Statistics */}
                          <div className="p-6 bg-background/40 rounded-xl border border-white/10">
                            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                              <BarChart3 className="h-5 w-5 text-primary" />
                              Jobbkategorier du sökt i
                            </h4>
                            
                            <div className="space-y-3">
                              {[
                                { category: 'Teknik & IT', count: 8, percentage: 40 },
                                { category: 'Design & UX', count: 4, percentage: 20 },
                                { category: 'Marknadsföring', count: 3, percentage: 15 },
                                { category: 'Produktledning', count: 3, percentage: 15 },
                                { category: 'Övrigt', count: 2, percentage: 10 }
                              ].map((item) => (
                                <div key={item.category} className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-foreground">{item.category}</span>
                                    <span className="text-sm text-muted-foreground">{item.count} ansökningar ({item.percentage}%)</span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300" 
                                      style={{ width: `${item.percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recent Activity Timeline */}
                          <div className="p-6 bg-background/40 rounded-xl border border-white/10">
                            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-primary" />
                              Senaste månaden
                            </h4>
                            
                            <div className="space-y-4">
                              {[
                                { date: '2024-01-15', action: 'Skickade ansökan', job: 'Senior Developer', company: 'BigTech AB' },
                                { date: '2024-01-12', action: 'Sparade jobb', job: 'Frontend Developer', company: 'Tech AB' },
                                { date: '2024-01-10', action: 'Skickade ansökan', job: 'Product Manager', company: 'Innovation Co' },
                                { date: '2024-01-08', action: 'Sparade jobb', job: 'UX Designer', company: 'Design Studio' }
                              ].map((activity, index) => (
                                <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-background/60 border border-white/5">
                                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium text-foreground">{activity.action}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(activity.date).toLocaleDateString('sv-SE')}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {activity.job} - {activity.company}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="jobs" className="space-y-6 animate-fade-in">
                <SavedJobsSection />
              </TabsContent>

              <TabsContent value="alerts" className="space-y-6 animate-fade-in">
                <JobAlertsSection />
              </TabsContent>

              <TabsContent value="applications" className="space-y-6 animate-fade-in">
                <Card className="border-0 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-accent" />
                      </div>
                      Dina ansökningar
                    </CardTitle>
                    <CardDescription>Status på alla dina jobbansökningar</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockApplications.map((app, index) => (
                      <div key={app.id} className="p-4 rounded-xl bg-gradient-to-r from-background/60 to-background/40 border border-white/10 hover:border-white/20 transition-all duration-300 hover-scale">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 space-y-3">
                            <h3 className="font-semibold text-lg text-accent">{app.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Building className="h-4 w-4" />
                              <span>{app.company}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={`px-3 py-1 rounded-full ${
                                app.status === "Intervju bokad" 
                                  ? "bg-green-100 text-green-700" 
                                  : "bg-blue-100 text-blue-700"
                              }`}>
                                {app.status}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{app.date}</span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" className="px-4 py-2 rounded-xl bg-white border-2 border-gray-300 shadow-clay-base hover:shadow-clay-pressed text-gray-700 hover:text-primary font-medium transition-all duration-300">
                            Detaljer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cv" className="space-y-6 animate-fade-in">
                <Card className="border-0 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      Ditt CV & Profil
                    </CardTitle>
                    <CardDescription>Hantera ditt CV och kompetenser</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-wrap gap-3">
                      <Button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-white border-2 border-primary/20 shadow-clay-elevated hover:shadow-clay-pressed font-semibold transition-all duration-300">
                        <Upload className="h-4 w-4 mr-2" />
                        Ladda upp dokument
                      </Button>
                      <Button className="px-6 py-3 rounded-2xl bg-white border-2 border-gray-300 shadow-clay-base hover:shadow-clay-pressed text-gray-700 hover:text-primary font-semibold transition-all duration-300">
                        <Download className="h-4 w-4 mr-2" />
                        Ladda ner
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-base font-medium">Profil beskrivning</Label>
                        <Textarea
                          id="bio"
                          placeholder="Berätta om dig själv och din yrkesexperiens..."
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="border-0 rounded-xl px-4 py-3 bg-background/40"
                          rows={4}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-base font-medium">Kompetenser</Label>
                        <div className="flex flex-wrap gap-2">
                          {["React", "TypeScript", "Node.js", "Python", "UI/UX Design"].map((skill, index) => (
                            <Badge 
                              key={skill} 
                              className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border-0 hover-scale transition-all duration-300 cursor-pointer"
                            >
                              {skill}
                            </Badge>
                          ))}
                          <Button 
                            size="sm" 
                            className="h-auto px-4 py-2 rounded-xl border-2 border-dashed border-primary/30 bg-white/80 hover:bg-white shadow-clay-inset hover:shadow-clay-base text-primary hover:text-primary/80 font-medium transition-all duration-300"
                          >
                            + Lägg till
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-8 animate-fade-in">
                <div className="relative group/settings">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-primary/5 to-accent/8 rounded-3xl blur-2xl opacity-40 group-hover/settings:opacity-60 transition-opacity duration-500"></div>
                  <Card className="relative border-0 bg-gradient-to-br from-background/90 via-background/70 to-background/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden">
                    <div className="absolute top-6 right-8 w-16 h-16 bg-gradient-to-br from-accent/15 to-primary/15 rounded-full blur-xl opacity-40 animate-pulse"></div>
                    <CardHeader className="pb-6 pt-8">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center shadow-inner">
                          <Settings className="h-6 w-6 text-accent" />
                        </div>
                        Inställningar
                      </CardTitle>
                      <CardDescription className="text-base">Hantera dina kontoinställningar och preferenser</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 pb-8">
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-3">
                          <span className="text-2xl">🔔</span>
                          Notifieringar
                        </h3>
                        <div className="space-y-4">
                          {[
                            { title: "E-postnotifieringar", description: "Få notifieringar om nya jobb", action: "Aktivera" },
                            { title: "Jobbvarningar", description: "Veckovis sammanfattning av nya jobb", action: "Konfigurera" }
                          ].map((item, index) => (
                            <div 
                              key={item.title} 
                              className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-background/60 to-background/40 shadow-inner border border-white/10 hover:border-white/20 hover:shadow-lg transition-all duration-300 hover-scale group/item animate-fade-in"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <div className="flex-1">
                                <p className="font-semibold text-lg">{item.title}</p>
                                <p className="text-muted-foreground">{item.description}</p>
                              </div>
                              <Button 
                                className="px-6 py-3 rounded-2xl bg-white border-2 border-gray-300 shadow-clay-base hover:shadow-clay-pressed text-gray-700 hover:text-primary font-semibold transition-all duration-300"
                                size="sm"
                              >
                                {item.action}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
