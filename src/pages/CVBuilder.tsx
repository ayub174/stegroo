import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
  address: string;
  postalCode: string;
  city: string;
}

export default function CVBuilder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    birthDate: "",
    address: "",
    postalCode: "",
    city: ""
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  const predefinedTags = [
    "Kommunikation", "Ledarskap", "Problemlösning", "Teamwork", 
    "Kreativitet", "Analytiskt tänkande", "Projektledning", "Innovation",
    "Kundservice", "Flexibilitet"
  ];

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSaveCV = () => {
    toast({
      title: "CV Sparat!",
      description: "Ditt CV har sparats framgångsrikt",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-muted/20 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute top-1/2 right-20 w-96 h-96 bg-accent/8 rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-primary/6 rounded-full blur-3xl animate-pulse opacity-50" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <div className="relative p-6 border-b border-white/10 bg-gradient-to-r from-background/80 to-background/60">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
        <div className="relative container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/profile")}
              className="px-4 py-2 rounded-2xl bg-background/60 hover:bg-background/80 shadow-inner border border-white/20 hover:border-white/30 hover-scale transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka till profil
            </Button>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent">
            CV Byggare
          </h1>
          <div className="w-32"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8 min-h-screen">
          {/* Left Column - Form */}
          <div className="w-1/2 space-y-8">
            {/* Personal Information */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-accent/5 rounded-3xl blur-xl opacity-50"></div>
              <Card className="relative border-0 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl rounded-3xl shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-inner">
                      <span className="text-xl">👤</span>
                    </div>
                    Personuppgifter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-semibold">Förnamn</Label>
                      <Input
                        id="firstName"
                        value={personalInfo.firstName}
                        onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                        className="border-0 shadow-inner rounded-2xl px-4 py-3 bg-background/40 focus:shadow-lg focus:shadow-primary/20 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-semibold">Efternamn</Label>
                      <Input
                        id="lastName"
                        value={personalInfo.lastName}
                        onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                        className="border-0 shadow-inner rounded-2xl px-4 py-3 bg-background/40 focus:shadow-lg focus:shadow-primary/20 transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-sm font-semibold">Födelsedatum</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={personalInfo.birthDate}
                      onChange={(e) => handlePersonalInfoChange('birthDate', e.target.value)}
                      className="border-0 shadow-inner rounded-2xl px-4 py-3 bg-background/40 focus:shadow-lg focus:shadow-primary/20 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-semibold">Adress</Label>
                    <Input
                      id="address"
                      value={personalInfo.address}
                      onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                      className="border-0 shadow-inner rounded-2xl px-4 py-3 bg-background/40 focus:shadow-lg focus:shadow-primary/20 transition-all duration-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="text-sm font-semibold">Postnummer</Label>
                      <Input
                        id="postalCode"
                        value={personalInfo.postalCode}
                        onChange={(e) => handlePersonalInfoChange('postalCode', e.target.value)}
                        className="border-0 shadow-inner rounded-2xl px-4 py-3 bg-background/40 focus:shadow-lg focus:shadow-primary/20 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-semibold">Ort</Label>
                      <Input
                        id="city"
                        value={personalInfo.city}
                        onChange={(e) => handlePersonalInfoChange('city', e.target.value)}
                        className="border-0 shadow-inner rounded-2xl px-4 py-3 bg-background/40 focus:shadow-lg focus:shadow-primary/20 transition-all duration-300"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Accordion Sections */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/8 to-primary/5 rounded-3xl blur-xl opacity-50"></div>
              <Card className="relative border-0 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl rounded-3xl shadow-xl">
                <CardContent className="p-6">
                  <Accordion type="multiple" className="space-y-4">
                    {[
                      { value: "education", label: "Utbildning", icon: "🎓" },
                      { value: "experience", label: "Arbetslivserfarenhet", icon: "💼" },
                      { value: "skills", label: "Färdigheter", icon: "⚡" },
                      { value: "languages", label: "Språk", icon: "🗣️" },
                      { value: "hobbies", label: "Hobby", icon: "🎨" }
                    ].map((section) => (
                      <AccordionItem key={section.value} value={section.value} className="border-0">
                        <AccordionTrigger className="text-lg font-semibold px-6 py-4 rounded-2xl bg-gradient-to-r from-background/60 to-background/40 shadow-inner border border-white/10 hover:border-white/20 hover:shadow-lg transition-all duration-300 hover:no-underline">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{section.icon}</span>
                            {section.label}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 px-6">
                          <div className="p-6 rounded-2xl bg-background/30 shadow-inner border border-white/10">
                            <p className="text-muted-foreground">Innehåll för {section.label} kommer här...</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Tags Section */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-accent/5 rounded-3xl blur-xl opacity-50"></div>
              <Card className="relative border-0 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl rounded-3xl shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-inner">
                      <span className="text-xl">🏷️</span>
                    </div>
                    Taggar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Predefined Tags */}
                  <div className="space-y-3">
                    <Label className="font-semibold">Förbestämda taggar</Label>
                    <div className="flex flex-wrap gap-3">
                      {predefinedTags.map((tag) => (
                        <Badge
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className={`px-4 py-2 rounded-full cursor-pointer hover-scale transition-all duration-300 ${
                            selectedTags.includes(tag)
                              ? "bg-gradient-to-r from-primary/30 to-accent/30 border-primary/50 shadow-inner"
                              : "bg-gradient-to-r from-background/60 to-background/40 shadow-inner border border-white/20 hover:border-white/30"
                          }`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Custom Tag Input */}
                  <div className="space-y-3">
                    <Label className="font-semibold">Lägg till egen tagg</Label>
                    <div className="flex gap-3">
                      <Input
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        placeholder="Skriv din egen tagg..."
                        className="flex-1 border-0 shadow-inner rounded-2xl px-4 py-3 bg-background/40 focus:shadow-lg focus:shadow-primary/20 transition-all duration-300"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                      />
                      <Button
                        onClick={handleAddCustomTag}
                        className="px-4 py-3 rounded-2xl bg-gradient-to-r from-primary via-primary-hover to-accent hover:from-primary-hover hover:via-accent hover:to-primary shadow-lg hover:shadow-xl hover:shadow-primary/40 border-0 hover-scale transition-all duration-300"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Selected Tags */}
                  {selectedTags.length > 0 && (
                    <div className="space-y-3">
                      <Label className="font-semibold">Valda taggar</Label>
                      <div className="flex flex-wrap gap-3">
                        {selectedTags.map((tag) => (
                          <Badge
                            key={tag}
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border-0 shadow-inner flex items-center gap-2"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:bg-red-500/20 rounded-full p-1 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Save Button */}
            <div className="relative group pb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-50"></div>
              <Card className="relative border-0 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl rounded-3xl shadow-xl">
                <CardContent className="p-8 text-center">
                  <Button
                    onClick={handleSaveCV}
                    className="px-12 py-4 text-lg rounded-3xl bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl hover:shadow-green-500/40 border-0 hover-scale transition-all duration-300"
                  >
                    <Save className="h-5 w-5 mr-3" />
                    Spara CV
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - CV Preview */}
          <div className="w-1/2 sticky top-8 h-fit">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/8 to-primary/5 rounded-3xl blur-xl opacity-50"></div>
              <Card className="relative border-0 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl rounded-3xl shadow-xl min-h-[600px]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center shadow-inner">
                      <span className="text-xl">📄</span>
                    </div>
                    CV Förhandsvisning
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center min-h-[500px]">
                  <div className="text-center space-y-4 opacity-60">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <span className="text-6xl">📝</span>
                    </div>
                    <p className="text-xl font-medium text-muted-foreground">
                      Ditt CV kommer att visas här
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Fyll i informationen till vänster för att se en live förhandsvisning
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}