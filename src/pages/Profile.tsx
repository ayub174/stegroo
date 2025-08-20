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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      
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
      
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="relative overflow-hidden border-border/20 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-xl shadow-2xl shadow-primary/5">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/15 rounded-full blur-2xl opacity-40"></div>
            
            <CardContent className="relative p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-4 border-primary/20 shadow-xl shadow-primary/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary-hover text-white">
                      {displayName ? displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="icon" variant="ghost" className="absolute -bottom-2 -right-2 bg-card/80 backdrop-blur-sm border border-border/20 hover:bg-primary/10">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      {editing ? (
                        <div className="space-y-2">
                          <Input
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Ditt namn"
                            className="text-xl font-bold bg-background/50 border-border/20"
                          />
                        </div>
                      ) : (
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent">
                          {displayName || "Ange ditt namn"}
                        </h1>
                      )}
                      <p className="text-muted-foreground flex items-center gap-2 mt-2">
                        <Mail className="h-4 w-4" />
                        {user?.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={profile?.account_type === 'business' ? 'default' : 'secondary'}>
                          {profile?.account_type === 'business' ? 'Företagskonto' : 'Privatkonto'}
                        </Badge>
                        {profile?.company_name && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {profile.company_name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {editing ? (
                        <>
                          <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg hover:shadow-primary/30">
                            <Save className="h-4 w-4 mr-2" />
                            Spara
                          </Button>
                          <Button variant="ghost" onClick={() => setEditing(false)}>
                            Avbryt
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setEditing(true)} variant="outline" className="border-border/20 hover:bg-primary/10">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Redigera
                        </Button>
                      )}
                      <Button variant="ghost" onClick={handleSignOut} className="hover:bg-destructive/10 hover:text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logga ut
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-card/50 backdrop-blur-sm border border-border/20">
              <TabsTrigger value="overview">Översikt</TabsTrigger>
              <TabsTrigger value="jobs">Sparade jobb</TabsTrigger>
              <TabsTrigger value="applications">Ansökningar</TabsTrigger>
              <TabsTrigger value="cv">CV</TabsTrigger>
              <TabsTrigger value="settings">Inställningar</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Quick Stats */}
                <Card className="border-border/20 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="h-5 w-5 text-primary" />
                      Sparade jobb
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {mockJobs.filter(j => j.saved).length}
                    </div>
                    <p className="text-sm text-muted-foreground">aktiva favoriter</p>
                  </CardContent>
                </Card>

                <Card className="border-border/20 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-accent" />
                      Ansökningar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent">
                      {mockApplications.length}
                    </div>
                    <p className="text-sm text-muted-foreground">pågående ansökningar</p>
                  </CardContent>
                </Card>

                <Card className="border-border/20 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Profilstyrka
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-500">
                      75%
                    </div>
                    <p className="text-sm text-muted-foreground">komplett profil</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="border-border/20 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <CardTitle>Senaste aktivitet</CardTitle>
                  <CardDescription>Dina senaste handlingar på plattformen</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-background/50 border border-border/20">
                    <Heart className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Sparade jobb: Frontend Developer</p>
                      <p className="text-sm text-muted-foreground">Tech AB - för 2 dagar sedan</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-background/50 border border-border/20">
                    <FileText className="h-5 w-5 text-accent" />
                    <div className="flex-1">
                      <p className="font-medium">Skickade ansökan: Product Manager</p>
                      <p className="text-sm text-muted-foreground">Innovation Co - för 5 dagar sedan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-6">
              <Card className="border-border/20 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookmarkIcon className="h-5 w-5" />
                    Dina sparade jobb
                  </CardTitle>
                  <CardDescription>Jobb du har sparat för att komma åt senare</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockJobs.filter(job => job.saved).map((job) => (
                    <div key={job.id} className="p-4 rounded-lg border border-border/20 bg-background/30 hover:bg-background/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-muted-foreground flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {job.company}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Visa jobb
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-primary to-primary-hover">
                            Ansök nu
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <Card className="border-border/20 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Dina ansökningar
                  </CardTitle>
                  <CardDescription>Översikt över alla dina jobbansökningar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockApplications.map((app) => (
                    <div key={app.id} className="p-4 rounded-lg border border-border/20 bg-background/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{app.title}</h3>
                          <p className="text-muted-foreground flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {app.company}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant={app.status === "Intervju bokad" ? "default" : "secondary"}>
                              {app.status}
                            </Badge>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {app.date}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Visa detaljer
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cv" className="space-y-6">
              <Card className="border-border/20 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Ditt CV
                  </CardTitle>
                  <CardDescription>Hantera ditt CV och kompetenser</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    <Button className="bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg hover:shadow-primary/30">
                      <Upload className="h-4 w-4 mr-2" />
                      Ladda upp CV
                    </Button>
                    <Button variant="outline" className="border-border/20">
                      <Download className="h-4 w-4 mr-2" />
                      Ladda ner CV
                    </Button>
                  </div>
                  
                  <Separator className="bg-border/20" />
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bio">Profil beskrivning</Label>
                      <Textarea
                        id="bio"
                        placeholder="Berätta om dig själv och din yrkesexperiens..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="mt-2 border-border/20 bg-background/50"
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label>Kompetenser</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {["React", "TypeScript", "Node.js", "Python", "UI/UX Design"].map((skill) => (
                          <Badge key={skill} variant="secondary" className="hover:bg-primary/20 cursor-pointer">
                            {skill}
                          </Badge>
                        ))}
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs border border-dashed border-border/40">
                          + Lägg till
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="border-border/20 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Inställningar
                  </CardTitle>
                  <CardDescription>Hantera dina kontoinställningar och preferenser</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Plats</Label>
                      <Input
                        id="location"
                        placeholder="Din stad"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="border-border/20 bg-background/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="070-123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border-border/20 bg-background/50"
                      />
                    </div>
                  </div>
                  
                  <Separator className="bg-border/20" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Notifieringar</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">E-postnotifieringar</p>
                          <p className="text-sm text-muted-foreground">Få notifieringar om nya jobb</p>
                        </div>
                        <Button variant="outline" size="sm">Aktivera</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Jobbvarningar</p>
                          <p className="text-sm text-muted-foreground">Veckovis sammanfattning av nya jobb</p>
                        </div>
                        <Button variant="outline" size="sm">Konfigurera</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}