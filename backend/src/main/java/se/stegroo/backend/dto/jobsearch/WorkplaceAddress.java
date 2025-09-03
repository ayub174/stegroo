package se.stegroo.backend.dto.jobsearch;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * Arbetsplatsadress från JobSearch API
 */
public class WorkplaceAddress {
    
    @JsonProperty("municipality")
    private String municipality;
    
    @JsonProperty("municipality_code")
    private String municipalityCode;
    
    @JsonProperty("municipality_concept_id")
    private String municipalityConceptId;
    
    @JsonProperty("region")
    private String region;
    
    @JsonProperty("region_code")
    private String regionCode;
    
    @JsonProperty("region_concept_id")
    private String regionConceptId;
    
    @JsonProperty("country")
    private String country;
    
    @JsonProperty("country_code")
    private String countryCode;
    
    @JsonProperty("country_concept_id")
    private String countryConceptId;
    
    @JsonProperty("street_address")
    private String streetAddress;
    
    @JsonProperty("postcode")
    private String postcode;
    
    @JsonProperty("city")
    private String city;
    
    @JsonProperty("coordinates")
    private List<Double> coordinates;

    // Getters and setters
    public String getMunicipality() { return municipality; }
    public void setMunicipality(String municipality) { this.municipality = municipality; }
    
    public String getMunicipalityCode() { return municipalityCode; }
    public void setMunicipalityCode(String municipalityCode) { this.municipalityCode = municipalityCode; }
    
    public String getMunicipalityConceptId() { return municipalityConceptId; }
    public void setMunicipalityConceptId(String municipalityConceptId) { this.municipalityConceptId = municipalityConceptId; }
    
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    
    public String getRegionCode() { return regionCode; }
    public void setRegionCode(String regionCode) { this.regionCode = regionCode; }
    
    public String getRegionConceptId() { return regionConceptId; }
    public void setRegionConceptId(String regionConceptId) { this.regionConceptId = regionConceptId; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }
    
    public String getCountryConceptId() { return countryConceptId; }
    public void setCountryConceptId(String countryConceptId) { this.countryConceptId = countryConceptId; }
    
    public String getStreetAddress() { return streetAddress; }
    public void setStreetAddress(String streetAddress) { this.streetAddress = streetAddress; }
    
    public String getPostcode() { return postcode; }
    public void setPostcode(String postcode) { this.postcode = postcode; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public List<Double> getCoordinates() { return coordinates; }
    public void setCoordinates(List<Double> coordinates) { this.coordinates = coordinates; }
}
