package se.stegroo.backend.dto.jobsearch;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Arbetsgivare från JobSearch API
 */
public class Employer {
    
    @JsonProperty("name")
    private String name;
    
    @JsonProperty("workplace")
    private String workplace;
    
    @JsonProperty("organization_number")
    private String organizationNumber;
    
    @JsonProperty("phone_number")
    private String phoneNumber;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("url")
    private String url;

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getWorkplace() { return workplace; }
    public void setWorkplace(String workplace) { this.workplace = workplace; }
    
    public String getOrganizationNumber() { return organizationNumber; }
    public void setOrganizationNumber(String organizationNumber) { this.organizationNumber = organizationNumber; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
