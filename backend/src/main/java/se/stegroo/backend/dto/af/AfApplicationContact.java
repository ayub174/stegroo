package se.stegroo.backend.dto.af;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO för ansökningskontakt från Arbetsförmedlingens API
 */
public class AfApplicationContact {
    
    private String name;
    
    private String description;
    
    private String email;
    
    private String telephone;
    
    @JsonProperty("contact_type")
    private String contactType;
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    
    public String getContactType() { return contactType; }
    public void setContactType(String contactType) { this.contactType = contactType; }
}
