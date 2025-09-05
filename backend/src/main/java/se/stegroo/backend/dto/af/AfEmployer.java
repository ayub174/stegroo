package se.stegroo.backend.dto.af;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO för arbetsgivare från Arbetsförmedlingens API
 */
public class AfEmployer {
    
    @JsonProperty("phone_number")
    private String phoneNumber;
    
    private String email;
    
    private String url;
    
    @JsonProperty("organization_number")
    private String organizationNumber;
    
    private String name;
    
    private String workplace;
    
    // Getters and Setters
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    
    public String getOrganizationNumber() { return organizationNumber; }
    public void setOrganizationNumber(String organizationNumber) { this.organizationNumber = organizationNumber; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getWorkplace() { return workplace; }
    public void setWorkplace(String workplace) { this.workplace = workplace; }
}
