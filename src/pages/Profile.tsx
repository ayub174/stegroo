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
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { CVBuilderModal } from "@/components/ui/cv-builder-modal";
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
  BookmarkIcon
} from "lucide-react";

type Profile = {
  id: string;
  user_id: string;
  account_type: 'private' | 'business';
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
  const [cvBuilderOpen, setCvBuilderOpen] = useState(false);
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
      
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
          {/* Profile Header with Claymorphism */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
            <Card className="relative border-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary/10 hover:shadow-3xl hover:shadow-primary/15 transition-all duration-500 hover-scale overflow-hidden">
              {/* Floating orbs */}
              <div className="absolute top-6 right-8 w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl opacity-40 animate-pulse"></div>
              <div className="absolute bottom-8 left-6 w-16 h-16 bg-gradient-to-br from-accent/15 to-primary/15 rounded-full blur-lg opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              <CardContent className="relative p-10">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="relative group/avatar">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-xl opacity-0 group-hover/avatar:opacity-60 transition-opacity duration-300"></div>
                    <Avatar className="relative w-28 h-28 rounded-full border-4 border-white/20 shadow-2xl shadow-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 hover-scale transition-all duration-300">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary via-primary-hover to-accent text-white rounded-full">
                        {displayName ? displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-background/90 to-background/70 backdrop-blur-sm border border-white/20 hover:border-primary/40 shadow-lg hover:shadow-xl hover:shadow-primary/30 hover-scale transition-all duration-300"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="space-y-4">
                        {editing ? (
                          <div className="space-y-3">
                            <Input
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              placeholder="Ditt namn"
                              className="text-2xl font-bold bg-background/50 border-0 shadow-inner rounded-2xl px-6 py-4 focus:shadow-lg focus:shadow-primary/20 transition-all duration-300"
                            />
                          </div>
                        ) : (
                          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent animate-fade-in">
                            {displayName || "Ange ditt namn"}
                          </h1>
                        )}
                        
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-background/30 shadow-inner border border-white/10">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                            <Mail className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-muted-foreground font-medium">{user?.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border-0 shadow-inner hover:shadow-lg hover-scale transition-all duration-300">
                            {profile?.account_type === 'business' ? 'Företagskonto' : 'Privatkonto'}
                          </Badge>
                          {profile?.company_name && (
                            <Badge className="px-4 py-2 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border-0 shadow-inner hover:shadow-lg hover-scale transition-all duration-300 flex items-center gap-2">
                              <Building className="h-3 w-3" />
                              {profile.company_name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        {editing ? (
                          <>
                            <Button 
                              onClick={handleSaveProfile} 
                              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary via-primary-hover to-accent hover:from-primary-hover hover:via-accent hover:to-primary shadow-lg hover:shadow-xl hover:shadow-primary/40 border-0 hover-scale transition-all duration-300"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Spara
                            </Button>
                            <Button 
                              onClick={() => setEditing(false)}
                              className="px-6 py-3 rounded-2xl bg-background/60 hover:bg-background/80 shadow-inner border border-white/20 hover:border-white/30 hover-scale transition-all duration-300"
                            >
                              Avbryt
                            </Button>
                          </>
                        ) : (
                          <Button 
                            onClick={() => setEditing(true)} 
                            className="px-6 py-3 rounded-2xl bg-background/60 hover:bg-background/80 shadow-inner border border-white/20 hover:border-primary/30 hover-scale transition-all duration-300"
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Redigera
                          </Button>
                        )}
                        <Button 
                          onClick={handleSignOut}
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-100/60 to-red-50/60 hover:from-red-200/60 hover:to-red-100/60 text-red-600 hover:text-red-700 shadow-inner border border-red-200/30 hover:border-red-300/40 hover-scale transition-all duration-300"
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

          {/* Main Content with Clay Tabs */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/3 to-primary/5 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            <Tabs defaultValue="overview" className="relative space-y-8">
              <TabsList className="w-full h-auto p-2 bg-gradient-to-r from-background/80 via-background/60 to-background/80 backdrop-blur-xl border-0 shadow-2xl shadow-primary/10 rounded-3xl grid grid-cols-5 gap-2">
                {[
                  { value: "overview", label: "Översikt", icon: "📊" },
                  { value: "jobs", label: "Sparade jobb", icon: "💼" },
                  { value: "applications", label: "Ansökningar", icon: "📋" },
                  { value: "cv", label: "CV", icon: "🎓" },
                  { value: "settings", label: "Inställningar", icon: "⚙️" }
                ].map((tab) => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value} 
                    className="flex-col gap-2 h-20 rounded-2xl bg-transparent hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/20 data-[state=active]:to-accent/15 data-[state=active]:shadow-inner data-[state=active]:shadow-primary/20 border-0 transition-all duration-300 hover-scale group/tab"
                  >
                    <span className="text-2xl group-hover/tab:animate-pulse">{tab.icon}</span>
                    <span className="text-sm font-medium">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="space-y-8 animate-fade-in">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {/* Enhanced Quick Stats with Clay Style */}
                  {[
                    { 
                      title: "Sparade jobb", 
                      icon: Heart, 
                      value: mockJobs.filter(j => j.saved).length, 
                      description: "aktiva favoriter",
                      color: "primary",
                      gradient: "from-primary/30 to-primary/10"
                    },
                    { 
                      title: "Ansökningar", 
                      icon: FileText, 
                      value: mockApplications.length, 
                      description: "pågående ansökningar",
                      color: "accent",
                      gradient: "from-accent/30 to-accent/10"
                    },
                    { 
                      title: "Profilstyrka", 
                      icon: Star, 
                      value: "75%", 
                      description: "komplett profil",
                      color: "yellow-500",
                      gradient: "from-yellow-200/30 to-yellow-100/10"
                    }
                  ].map((stat, index) => (
                    <div key={stat.title} className="relative group/stat" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl blur-xl opacity-0 group-hover/stat:opacity-60 transition-opacity duration-500`}></div>
                      <Card className="relative border-0 bg-gradient-to-br from-background/90 via-background/70 to-background/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover-scale overflow-hidden animate-fade-in">
                        <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-lg opacity-30 animate-pulse"></div>
                        <CardHeader className="pb-4 pt-8">
                          <CardTitle className="flex items-center gap-3 text-xl">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-inner group-hover/stat:animate-pulse`}>
                              <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                            </div>
                            {stat.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-8">
                          <div className={`text-5xl font-bold text-${stat.color} mb-2 group-hover/stat:animate-pulse`}>
                            {stat.value}
                          </div>
                          <p className="text-muted-foreground font-medium">{stat.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>

                {/* Enhanced Recent Activity */}
                <div className="relative group/activity">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/5 to-primary/8 rounded-3xl blur-2xl opacity-40 group-hover/activity:opacity-60 transition-opacity duration-500"></div>
                  <Card className="relative border-0 bg-gradient-to-br from-background/90 via-background/70 to-background/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden animate-fade-in">
                    <div className="absolute top-6 right-8 w-16 h-16 bg-gradient-to-br from-primary/15 to-accent/15 rounded-full blur-xl opacity-40 animate-pulse"></div>
                    <CardHeader className="pb-6 pt-8">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-inner">
                          <span className="text-2xl animate-pulse">📈</span>
                        </div>
                        Senaste aktivitet
                      </CardTitle>
                      <CardDescription className="text-base">Dina senaste handlingar på plattformen</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pb-8">
                      {[
                        { icon: Heart, title: "Sparade jobb: Frontend Developer", subtitle: "Tech AB - för 2 dagar sedan", color: "primary" },
                        { icon: FileText, title: "Skickade ansökan: Product Manager", subtitle: "Innovation Co - för 5 dagar sedan", color: "accent" }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-background/60 to-background/40 shadow-inner border border-white/10 hover:border-white/20 hover:shadow-lg transition-all duration-300 hover-scale group/item">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-${activity.color}/20 to-${activity.color}/10 flex items-center justify-center shadow-inner group-hover/item:animate-pulse`}>
                            <activity.icon className={`h-5 w-5 text-${activity.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-lg">{activity.title}</p>
                            <p className="text-muted-foreground">{activity.subtitle}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="jobs" className="space-y-8 animate-fade-in">
                <div className="relative group/jobs">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/5 to-primary/8 rounded-3xl blur-2xl opacity-40 group-hover/jobs:opacity-60 transition-opacity duration-500"></div>
                  <Card className="relative border-0 bg-gradient-to-br from-background/90 via-background/70 to-background/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden">
                    <div className="absolute top-6 right-8 w-16 h-16 bg-gradient-to-br from-primary/15 to-accent/15 rounded-full blur-xl opacity-40 animate-pulse"></div>
                    <CardHeader className="pb-6 pt-8">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-inner">
                          <BookmarkIcon className="h-6 w-6 text-primary" />
                        </div>
                        Dina sparade jobb
                      </CardTitle>
                      <CardDescription className="text-base">Jobb du har sparat för att komma åt senare</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pb-8">
                      {mockJobs.filter(job => job.saved).map((job, index) => (
                        <div key={job.id} className="relative group/job" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover/job:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative p-6 rounded-2xl bg-gradient-to-r from-background/80 to-background/60 shadow-inner border border-white/10 hover:border-white/20 hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1 space-y-3">
                                <h3 className="font-bold text-xl text-primary">{job.title}</h3>
                                <div className="flex items-center gap-3 p-2 rounded-xl bg-background/40 shadow-inner w-fit">
                                  <Building className="h-4 w-4 text-accent" />
                                  <span className="font-medium">{job.company}</span>
                                </div>
                                <div className="flex items-center gap-3 p-2 rounded-xl bg-background/40 shadow-inner w-fit">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{job.location}</span>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <Button 
                                  size="sm" 
                                  className="px-4 py-2 rounded-xl bg-background/60 hover:bg-background/80 shadow-inner border border-white/20 hover:border-white/30 hover-scale transition-all duration-300"
                                >
                                  Visa jobb
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary via-primary-hover to-accent hover:from-primary-hover hover:via-accent hover:to-primary shadow-lg hover:shadow-xl hover:shadow-primary/40 border-0 hover-scale transition-all duration-300"
                                >
                                  Ansök nu
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="applications" className="space-y-8 animate-fade-in">
                <div className="relative group/apps">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-primary/5 to-accent/8 rounded-3xl blur-2xl opacity-40 group-hover/apps:opacity-60 transition-opacity duration-500"></div>
                  <Card className="relative border-0 bg-gradient-to-br from-background/90 via-background/70 to-background/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden">
                    <div className="absolute top-6 right-8 w-16 h-16 bg-gradient-to-br from-accent/15 to-primary/15 rounded-full blur-xl opacity-40 animate-pulse"></div>
                    <CardHeader className="pb-6 pt-8">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center shadow-inner">
                          <FileText className="h-6 w-6 text-accent" />
                        </div>
                        Dina ansökningar
                      </CardTitle>
                      <CardDescription className="text-base">Översikt över alla dina jobbansökningar</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pb-8">
                      {mockApplications.map((app, index) => (
                        <div key={app.id} className="relative group/app" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5 rounded-2xl opacity-0 group-hover/app:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative p-6 rounded-2xl bg-gradient-to-r from-background/80 to-background/60 shadow-inner border border-white/10 hover:border-white/20 hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1 space-y-4">
                                <h3 className="font-bold text-xl text-accent">{app.title}</h3>
                                <div className="flex items-center gap-3 p-2 rounded-xl bg-background/40 shadow-inner w-fit">
                                  <Building className="h-4 w-4 text-primary" />
                                  <span className="font-medium">{app.company}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <Badge className={`px-4 py-2 rounded-full shadow-inner border-0 ${
                                    app.status === "Intervju bokad" 
                                      ? "bg-gradient-to-r from-green-200/30 to-green-100/20 text-green-700" 
                                      : "bg-gradient-to-r from-blue-200/30 to-blue-100/20 text-blue-700"
                                  }`}>
                                    {app.status}
                                  </Badge>
                                  <div className="flex items-center gap-2 p-2 rounded-xl bg-background/40 shadow-inner">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{app.date}</span>
                                  </div>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                className="px-4 py-2 rounded-xl bg-background/60 hover:bg-background/80 shadow-inner border border-white/20 hover:border-white/30 hover-scale transition-all duration-300"
                              >
                                Visa detaljer
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="cv" className="space-y-8 animate-fade-in">
                <div className="relative group/cv">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/5 to-primary/8 rounded-3xl blur-2xl opacity-40 group-hover/cv:opacity-60 transition-opacity duration-500"></div>
                  <Card className="relative border-0 bg-gradient-to-br from-background/90 via-background/70 to-background/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden">
                    <div className="absolute top-6 right-8 w-16 h-16 bg-gradient-to-br from-primary/15 to-accent/15 rounded-full blur-xl opacity-40 animate-pulse"></div>
                    <CardHeader className="pb-6 pt-8">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-inner">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        Ditt CV
                      </CardTitle>
                      <CardDescription className="text-base">Hantera ditt CV och kompetenser</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 pb-8">
                      <div className="flex gap-4">
                        <Button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary via-primary-hover to-accent hover:from-primary-hover hover:via-accent hover:to-primary shadow-lg hover:shadow-xl hover:shadow-primary/40 border-0 hover-scale transition-all duration-300">
                          <Upload className="h-4 w-4 mr-2" />
                          Ladda upp CV
                        </Button>
                        <Button 
                          onClick={() => setCvBuilderOpen(true)}
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl hover:shadow-green-500/40 border-0 hover-scale transition-all duration-300"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Skapa CV
                        </Button>
                        <Button className="px-6 py-3 rounded-2xl bg-background/60 hover:bg-background/80 shadow-inner border border-white/20 hover:border-white/30 hover-scale transition-all duration-300">
                          <Download className="h-4 w-4 mr-2" />
                          Ladda ner CV
                        </Button>
                      </div>
                      
                      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                      
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="bio" className="text-lg font-semibold">Profil beskrivning</Label>
                          <Textarea
                            id="bio"
                            placeholder="Berätta om dig själv och din yrkesexperiens..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="border-0 shadow-inner rounded-2xl px-6 py-4 bg-background/40 focus:shadow-lg focus:shadow-primary/20 transition-all duration-300"
                            rows={4}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <Label className="text-lg font-semibold">Kompetenser</Label>
                          <div className="flex flex-wrap gap-3">
                            {["React", "TypeScript", "Node.js", "Python", "UI/UX Design"].map((skill, index) => (
                              <Badge 
                                key={skill} 
                                className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border-0 shadow-inner hover:shadow-lg hover-scale transition-all duration-300 cursor-pointer group/skill"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <span className="group-hover/skill:animate-pulse">{skill}</span>
                              </Badge>
                            ))}
                            <Button 
                              size="sm" 
                              className="h-auto px-4 py-2 rounded-full border-2 border-dashed border-primary/30 bg-transparent hover:bg-primary/10 hover:border-primary/50 text-primary hover-scale transition-all duration-300"
                            >
                              + Lägg till
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                      <div className="grid gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="location" className="text-lg font-semibold">Plats</Label>
                          <Input
                            id="location"
                            placeholder="Din stad"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="border-0 shadow-inner rounded-2xl px-6 py-4 bg-background/40 focus:shadow-lg focus:shadow-primary/20 transition-all duration-300"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="phone" className="text-lg font-semibold">Telefon</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="070-123 45 67"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="border-0 shadow-inner rounded-2xl px-6 py-4 bg-background/40 focus:shadow-lg focus:shadow-primary/20 transition-all duration-300"
                          />
                        </div>
                      </div>
                      
                      <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
                      
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
                                className="px-4 py-2 rounded-xl bg-background/60 hover:bg-background/80 shadow-inner border border-white/20 hover:border-primary/30 hover-scale transition-all duration-300"
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
            </Tabs>
          </div>
        </div>
      </main>

      <CVBuilderModal 
        open={cvBuilderOpen} 
        onOpenChange={setCvBuilderOpen} 
      />

      <Footer />
    </div>
  );
}