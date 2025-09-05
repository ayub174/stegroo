import { useState, useEffect } from "react";
import { Bell, Plus, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { JobAlertCard } from "./job-alert-card";
import { CreateJobAlertDialog } from "./create-job-alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface JobAlert {
  id: string;
  title: string;
  location?: string;
  jobType?: string;
  keywords?: string[];
  frequency: 'daily' | 'weekly';
  createdAt: string;
  jobCount: number;
}

export const JobAlertsSection = () => {
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load job alerts from localStorage on component mount
  useEffect(() => {
    loadJobAlerts();
  }, []);

  const loadJobAlerts = () => {
    try {
      const savedAlerts = localStorage.getItem('jobAlerts');
      if (savedAlerts) {
        setJobAlerts(JSON.parse(savedAlerts));
      } else {
        // Add some default demo alerts if none exist
        const defaultAlerts: JobAlert[] = [
          {
            id: '1',
            title: 'Frontend utvecklare jobb',
            location: 'Stockholm',
            jobType: 'Heltid',
            keywords: ['React', 'TypeScript'],
            frequency: 'daily',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            jobCount: 12
          },
          {
            id: '2',
            title: 'UX Designer positioner',
            location: 'Göteborg',
            keywords: ['Figma', 'UI/UX'],
            frequency: 'weekly',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            jobCount: 5
          }
        ];
        setJobAlerts(defaultAlerts);
        localStorage.setItem('jobAlerts', JSON.stringify(defaultAlerts));
      }
    } catch (error) {
      console.error('Error loading job alerts:', error);
    }
  };

  const handleDeleteAlert = (alertId: string) => {
    const updatedAlerts = jobAlerts.filter(alert => alert.id !== alertId);
    setJobAlerts(updatedAlerts);
    localStorage.setItem('jobAlerts', JSON.stringify(updatedAlerts));
    
    toast({
      title: "Bevakning borttagen",
      description: "Din jobbbevakning har tagits bort.",
    });
  };

  const handleEditAlert = (alert: JobAlert) => {
    // For now, just show a toast - could implement edit dialog later
    toast({
      title: "Redigera bevakning",
      description: "Redigeringsfunktion kommer snart!",
    });
  };

  const handleAlertCreated = (newAlert: JobAlert) => {
    setJobAlerts(prevAlerts => [...prevAlerts, newAlert]);
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Jobbevakningar</h2>
          <p className="text-muted-foreground">
            Få notiser när nya jobb som matchar dina kriterier publiceras
          </p>
        </div>
        <CreateJobAlertDialog 
          onAlertCreated={handleAlertCreated}
          trigger={
            <Button className="gap-2 bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl px-6 py-3">
              <Plus className="h-4 w-4" />
              Ny bevakning
            </Button>
          }
        />
      </div>

      {/* Job Alerts List */}
      {jobAlerts.length > 0 ? (
        <div className="space-y-4">
          {jobAlerts.map((alert) => (
            <JobAlertCard
              key={alert.id}
              alert={alert}
              onEdit={handleEditAlert}
              onDelete={handleDeleteAlert}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="border-0 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl rounded-3xl shadow-lg">
          <CardContent className="py-16 text-center">
            <div className="max-w-sm mx-auto space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto">
                <Bell className="h-10 w-10 text-primary" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  Inga jobbevakningar än
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Skapa din första jobbbevakning för att få notiser när nya jobb som 
                  matchar dina kriterier publiceras.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <CreateJobAlertDialog 
                  onAlertCreated={handleAlertCreated}
                  trigger={
                    <Button className="gap-2 bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl px-6 py-3">
                      <Plus className="h-4 w-4" />
                      Skapa din första bevakning
                    </Button>
                  }
                />
                <Button 
                  variant="outline" 
                  className="gap-2 rounded-2xl px-6 py-3 bg-white/80 hover:bg-white border-2 border-gray-200 hover:border-gray-300"
                  onClick={() => window.location.href = '/jobs'}
                >
                  <Search className="h-4 w-4" />
                  Sök jobb först
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="border-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center flex-shrink-0">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Så fungerar jobbevakningar</h4>
              <ul className="text-sm text-muted-foreground space-y-1 leading-relaxed">
                <li>• Få notiser via e-post när nya jobb publiceras</li>
                <li>• Välj mellan dagliga eller veckovisa uppdateringar</li>
                <li>• Anpassa med nyckelord, plats och anställningstyp</li>
                <li>• Pausa eller ta bort bevakningar när som helst</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};