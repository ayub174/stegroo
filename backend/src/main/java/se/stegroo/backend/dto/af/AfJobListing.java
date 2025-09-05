package se.stegroo.backend.dto.af;

import java.time.LocalDateTime;

/**
 * DTO för jobblisting från Arbetsförmedlingens sök-API (inte Jobstream)
 */
public class AfJobListing {
    
    private String id;
    private String headline;
    private String description;
    private String employer;
    private String location;
    private LocalDateTime applicationDeadline;
    private String url;
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getEmployer() { return employer; }
    public void setEmployer(String employer) { this.employer = employer; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public LocalDateTime getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDateTime applicationDeadline) { this.applicationDeadline = applicationDeadline; }
    
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
