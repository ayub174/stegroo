import { useEffect, useState } from "react";
import { Badge } from "./badge";
import { Button } from "./button";
import { Building2, MapPin, Calendar, Trash2, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface SavedJob {
  id: string;
  job_id: string;
  job_title: string;
  company: string;
  location: string;
  deadline: string;
  type: string;
  time_posted: string;
  tags: string[];
  logo?: string;
  created_at: string;
}

export const SavedJobsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSavedJobs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSavedJobs(data || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      toast({
        title: "Fel",
        description: "Kunde inte hämta sparade jobb.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveJob = async (jobId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', user.id)
        .eq('id', jobId);
      
      if (error) throw error;
      
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      toast({
        title: "Jobbet har tagits bort",
        description: "Jobbet har tagits bort från dina sparade jobb.",
      });
    } catch (error) {
      console.error('Error removing saved job:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ta bort jobbet. Försök igen senare.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-clay-base">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sparade jobb
        </h3>
        <p className="text-gray-600">Du behöver vara inloggad för att se sparade jobb.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-clay-base">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sparade jobb
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 bg-gray-50 rounded-xl border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-clay-base">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sparade jobb ({savedJobs.length})
        </h3>
        
        {savedJobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Du har inga sparade jobb än.</p>
            <Link to="/jobs">
              <Button className="bg-white border-2 border-gray-300 shadow-clay-base hover:shadow-clay-pressed text-gray-700 hover:text-primary font-medium transition-all duration-300">
                Börja söka jobb
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {savedJobs.map((job) => (
              <div key={job.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Company Logo */}
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 border border-gray-200">
                      {job.logo ? (
                        <img src={job.logo} alt={`${job.company} logo`} className="w-6 h-6 object-contain" />
                      ) : (
                        <Building2 className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1 truncate">
                        {job.job_title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate">{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="truncate">Ansök senast {job.deadline}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">{job.type}</Badge>
                        {job.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {job.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.tags.length - 2} mer
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Link to={`/job/${job.job_id}`}>
                      <Button size="sm" className="px-3 py-1 bg-white border-2 border-gray-300 shadow-clay-base hover:shadow-clay-pressed text-gray-700 hover:text-primary font-medium transition-all duration-300">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visa
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveJob(job.id)}
                      className="px-2 py-1 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500">
                  Sparad: {new Date(job.created_at).toLocaleDateString('sv-SE')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};