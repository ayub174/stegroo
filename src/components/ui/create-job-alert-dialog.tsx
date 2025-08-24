import { useState } from "react";
import { Bell, Plus, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Badge } from "./badge";
import { useToast } from "@/hooks/use-toast";

interface CreateJobAlertDialogProps {
  trigger?: React.ReactNode;
  defaultValues?: {
    searchQuery?: string;
    location?: string;
    jobType?: string;
  };
  onAlertCreated?: (alert: any) => void;
}

export const CreateJobAlertDialog = ({ 
  trigger, 
  defaultValues = {},
  onAlertCreated 
}: CreateJobAlertDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(`Bevakning: ${defaultValues.searchQuery || 'Nya jobb'}`);
  const [location, setLocation] = useState(defaultValues.location || 'all');
  const [jobType, setJobType] = useState(defaultValues.jobType || 'all');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [keywords, setKeywords] = useState<string[]>(defaultValues.searchQuery ? [defaultValues.searchQuery] : []);
  const [keywordInput, setKeywordInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleCreateAlert = async () => {
    setIsCreating(true);
    
    // Simulera API-anrop
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAlert = {
      id: Date.now().toString(),
      title,
      location: location !== 'all' ? location : undefined,
      jobType: jobType !== 'all' ? jobType : undefined,
      keywords: keywords.length > 0 ? keywords : undefined,
      frequency,
      createdAt: new Date().toISOString(),
      jobCount: Math.floor(Math.random() * 50) + 1
    };

    // Spara i localStorage för demo
    const existingAlerts = JSON.parse(localStorage.getItem('jobAlerts') || '[]');
    localStorage.setItem('jobAlerts', JSON.stringify([...existingAlerts, newAlert]));

    setIsCreating(false);
    setOpen(false);
    
    // Reset form
    setTitle('');
    setLocation('all');
    setJobType('all');
    setFrequency('daily');
    setKeywords([]);
    setKeywordInput('');
    
    toast({
      title: "Bevakning skapad!",
      description: "Du kommer få notiser när nya jobb som matchar dina kriterier publiceras.",
    });
    
    if (onAlertCreated) {
      onAlertCreated(newAlert);
    }
  };

  const defaultTrigger = (
    <Button className="gap-2 bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl px-6 py-3">
      <Bell className="h-4 w-4" />
      Skapa bevakning
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md border-0 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl rounded-3xl shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Skapa jobbbevakning</DialogTitle>
              <DialogDescription>
                Få notiser när nya jobb som matchar dina kriterier publiceras
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Titel */}
          <div className="space-y-2">
            <Label htmlFor="alert-title">Titel på bevakning</Label>
            <Input
              id="alert-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="T.ex. Frontend utvecklare jobb"
              className="rounded-xl border-0 bg-background/50"
            />
          </div>
          
          {/* Nyckelord */}
          <div className="space-y-3">
            <Label>Nyckelord</Label>
            <div className="flex gap-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Lägg till nyckelord"
                className="rounded-xl border-0 bg-background/50"
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
              />
              <Button
                type="button"
                onClick={handleAddKeyword}
                size="sm"
                className="px-4 rounded-xl"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/10 hover:text-destructive rounded-full px-3 py-1"
                    onClick={() => handleRemoveKeyword(keyword)}
                  >
                    {keyword} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {/* Stad */}
          <div className="space-y-2">
            <Label htmlFor="alert-location">Stad (valfritt)</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="rounded-xl border-0 bg-background/50">
                <SelectValue placeholder="Välj stad" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="all">Alla städer</SelectItem>
                <SelectItem value="Stockholm">Stockholm</SelectItem>
                <SelectItem value="Göteborg">Göteborg</SelectItem>
                <SelectItem value="Malmö">Malmö</SelectItem>
                <SelectItem value="Uppsala">Uppsala</SelectItem>
                <SelectItem value="Västerås">Västerås</SelectItem>
                <SelectItem value="Örebro">Örebro</SelectItem>
                <SelectItem value="Linköping">Linköping</SelectItem>
                <SelectItem value="Helsingborg">Helsingborg</SelectItem>
                <SelectItem value="Jönköping">Jönköping</SelectItem>
                <SelectItem value="Norrköping">Norrköping</SelectItem>
                <SelectItem value="Lund">Lund</SelectItem>
                <SelectItem value="Umeå">Umeå</SelectItem>
                <SelectItem value="Gävle">Gävle</SelectItem>
                <SelectItem value="Borås">Borås</SelectItem>
                <SelectItem value="Södertälje">Södertälje</SelectItem>
                <SelectItem value="Eskilstuna">Eskilstuna</SelectItem>
                <SelectItem value="Halmstad">Halmstad</SelectItem>
                <SelectItem value="Växjö">Växjö</SelectItem>
                <SelectItem value="Karlstad">Karlstad</SelectItem>
                <SelectItem value="Sundsvall">Sundsvall</SelectItem>
                <SelectItem value="Trollhättan">Trollhättan</SelectItem>
                <SelectItem value="Östersund">Östersund</SelectItem>
                <SelectItem value="Borlänge">Borlänge</SelectItem>
                <SelectItem value="Falun">Falun</SelectItem>
                <SelectItem value="Kalmar">Kalmar</SelectItem>
                <SelectItem value="Kristianstad">Kristianstad</SelectItem>
                <SelectItem value="Karlskrona">Karlskrona</SelectItem>
                <SelectItem value="Skövde">Skövde</SelectItem>
                <SelectItem value="Uddevalla">Uddevalla</SelectItem>
                <SelectItem value="Motala">Motala</SelectItem>
                <SelectItem value="Lidköping">Lidköping</SelectItem>
                <SelectItem value="Sandviken">Sandviken</SelectItem>
                <SelectItem value="Örnsköldsvik">Örnsköldsvik</SelectItem>
                <SelectItem value="Nyköping">Nyköping</SelectItem>
                <SelectItem value="Köping">Köping</SelectItem>
                <SelectItem value="Kiruna">Kiruna</SelectItem>
                <SelectItem value="Visby">Visby</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Jobbtyp */}
          <div className="space-y-2">
            <Label>Anställningstyp</Label>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="rounded-xl border-0 bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla typer</SelectItem>
                <SelectItem value="Heltid">Heltid</SelectItem>
                <SelectItem value="Deltid">Deltid</SelectItem>
                <SelectItem value="Konsult">Konsult</SelectItem>
                <SelectItem value="Praktik">Praktik</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Frekvens */}
          <div className="space-y-2">
            <Label>Notisfrekvens</Label>
            <Select value={frequency} onValueChange={(value: 'daily' | 'weekly') => setFrequency(value)}>
              <SelectTrigger className="rounded-xl border-0 bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Dagligen</SelectItem>
                <SelectItem value="weekly">Veckovis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-border/20">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1 rounded-xl"
          >
            Avbryt
          </Button>
          <Button
            onClick={handleCreateAlert}
            disabled={isCreating}
            className="flex-1 bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 rounded-xl"
          >
            {isCreating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Skapa bevakning
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};