package se.stegroo.backend.dto.af;

import java.util.List;

/**
 * DTO för sökresultat från Arbetsförmedlingens API
 */
public class AfJobSearchResponse {
    
    private List<AfJobListing> jobs;
    private int total;
    
    // Getters and Setters
    public List<AfJobListing> getJobs() { return jobs; }
    public void setJobs(List<AfJobListing> jobs) { this.jobs = jobs; }
    
    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
}
