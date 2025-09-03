package se.stegroo.backend.dto.af;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO för ett enskilt jobb från Arbetsförmedlingens Jobstream API
 */
public class AfJobStreamJob {
    
    private String id;
    
    @JsonProperty("external_id")
    private String externalId;
    
    @JsonProperty("original_id")
    private String originalId;
    
    private String label;
    
    @JsonProperty("webpage_url")
    private String webpageUrl;
    
    @JsonProperty("logo_url")
    private String logoUrl;
    
    private String headline;
    
    @JsonProperty("application_deadline")
    private LocalDateTime applicationDeadline;
    
    @JsonProperty("number_of_vacancies")
    private Integer numberOfVacancies;
    
    private AfDescription description;
    
    @JsonProperty("employment_type")
    private AfTaxonomy employmentType;
    
    @JsonProperty("salary_type")
    private AfTaxonomy salaryType;
    
    @JsonProperty("salary_description")
    private String salaryDescription;
    
    private AfTaxonomy duration;
    
    @JsonProperty("working_hours_type")
    private AfTaxonomy workingHoursType;
    
    @JsonProperty("scope_of_work")
    private AfScopeOfWork scopeOfWork;
    
    private String access;
    
    private AfEmployer employer;
    
    @JsonProperty("application_details")
    private AfApplicationDetails applicationDetails;
    
    @JsonProperty("experience_required")
    private Boolean experienceRequired;
    
    @JsonProperty("access_to_own_car")
    private Boolean accessToOwnCar;
    
    @JsonProperty("driving_license_required")
    private Boolean drivingLicenseRequired;
    
    @JsonProperty("driving_license")
    private List<AfDrivingLicense> drivingLicense;
    
    private AfTaxonomy occupation;
    
    @JsonProperty("occupation_group")
    private AfTaxonomy occupationGroup;
    
    @JsonProperty("occupation_field")
    private AfTaxonomy occupationField;
    
    @JsonProperty("workplace_address")
    private AfWorkplaceAddress workplaceAddress;
    
    @JsonProperty("must_have")
    private AfRequirements mustHave;
    
    @JsonProperty("nice_to_have")
    private AfRequirements niceToHave;
    
    @JsonProperty("application_contacts")
    private List<AfApplicationContact> applicationContacts;
    
    @JsonProperty("publication_date")
    private LocalDateTime publicationDate;
    
    @JsonProperty("last_publication_date")
    private LocalDateTime lastPublicationDate;
    
    private Boolean removed;
    
    @JsonProperty("removed_date")
    private LocalDateTime removedDate;
    
    @JsonProperty("source_type")
    private String sourceType;
    
    private Long timestamp;
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getExternalId() { return externalId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }
    
    public String getOriginalId() { return originalId; }
    public void setOriginalId(String originalId) { this.originalId = originalId; }
    
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    
    public String getWebpageUrl() { return webpageUrl; }
    public void setWebpageUrl(String webpageUrl) { this.webpageUrl = webpageUrl; }
    
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    
    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }
    
    public LocalDateTime getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDateTime applicationDeadline) { this.applicationDeadline = applicationDeadline; }
    
    public Integer getNumberOfVacancies() { return numberOfVacancies; }
    public void setNumberOfVacancies(Integer numberOfVacancies) { this.numberOfVacancies = numberOfVacancies; }
    
    public AfDescription getDescription() { return description; }
    public void setDescription(AfDescription description) { this.description = description; }
    
    public AfTaxonomy getEmploymentType() { return employmentType; }
    public void setEmploymentType(AfTaxonomy employmentType) { this.employmentType = employmentType; }
    
    public AfTaxonomy getSalaryType() { return salaryType; }
    public void setSalaryType(AfTaxonomy salaryType) { this.salaryType = salaryType; }
    
    public String getSalaryDescription() { return salaryDescription; }
    public void setSalaryDescription(String salaryDescription) { this.salaryDescription = salaryDescription; }
    
    public AfTaxonomy getDuration() { return duration; }
    public void setDuration(AfTaxonomy duration) { this.duration = duration; }
    
    public AfTaxonomy getWorkingHoursType() { return workingHoursType; }
    public void setWorkingHoursType(AfTaxonomy workingHoursType) { this.workingHoursType = workingHoursType; }
    
    public AfScopeOfWork getScopeOfWork() { return scopeOfWork; }
    public void setScopeOfWork(AfScopeOfWork scopeOfWork) { this.scopeOfWork = scopeOfWork; }
    
    public String getAccess() { return access; }
    public void setAccess(String access) { this.access = access; }
    
    public AfEmployer getEmployer() { return employer; }
    public void setEmployer(AfEmployer employer) { this.employer = employer; }
    
    public AfApplicationDetails getApplicationDetails() { return applicationDetails; }
    public void setApplicationDetails(AfApplicationDetails applicationDetails) { this.applicationDetails = applicationDetails; }
    
    public Boolean getExperienceRequired() { return experienceRequired; }
    public void setExperienceRequired(Boolean experienceRequired) { this.experienceRequired = experienceRequired; }
    
    public Boolean getAccessToOwnCar() { return accessToOwnCar; }
    public void setAccessToOwnCar(Boolean accessToOwnCar) { this.accessToOwnCar = accessToOwnCar; }
    
    public Boolean getDrivingLicenseRequired() { return drivingLicenseRequired; }
    public void setDrivingLicenseRequired(Boolean drivingLicenseRequired) { this.drivingLicenseRequired = drivingLicenseRequired; }
    
    public List<AfDrivingLicense> getDrivingLicense() { return drivingLicense; }
    public void setDrivingLicense(List<AfDrivingLicense> drivingLicense) { this.drivingLicense = drivingLicense; }
    
    public AfTaxonomy getOccupation() { return occupation; }
    public void setOccupation(AfTaxonomy occupation) { this.occupation = occupation; }
    
    public AfTaxonomy getOccupationGroup() { return occupationGroup; }
    public void setOccupationGroup(AfTaxonomy occupationGroup) { this.occupationGroup = occupationGroup; }
    
    public AfTaxonomy getOccupationField() { return occupationField; }
    public void setOccupationField(AfTaxonomy occupationField) { this.occupationField = occupationField; }
    
    public AfWorkplaceAddress getWorkplaceAddress() { return workplaceAddress; }
    public void setWorkplaceAddress(AfWorkplaceAddress workplaceAddress) { this.workplaceAddress = workplaceAddress; }
    
    public AfRequirements getMustHave() { return mustHave; }
    public void setMustHave(AfRequirements mustHave) { this.mustHave = mustHave; }
    
    public AfRequirements getNiceToHave() { return niceToHave; }
    public void setNiceToHave(AfRequirements niceToHave) { this.niceToHave = niceToHave; }
    
    public List<AfApplicationContact> getApplicationContacts() { return applicationContacts; }
    public void setApplicationContacts(List<AfApplicationContact> applicationContacts) { this.applicationContacts = applicationContacts; }
    
    public LocalDateTime getPublicationDate() { return publicationDate; }
    public void setPublicationDate(LocalDateTime publicationDate) { this.publicationDate = publicationDate; }
    
    public LocalDateTime getLastPublicationDate() { return lastPublicationDate; }
    public void setLastPublicationDate(LocalDateTime lastPublicationDate) { this.lastPublicationDate = lastPublicationDate; }
    
    public Boolean getRemoved() { return removed; }
    public void setRemoved(Boolean removed) { this.removed = removed; }
    
    public LocalDateTime getRemovedDate() { return removedDate; }
    public void setRemovedDate(LocalDateTime removedDate) { this.removedDate = removedDate; }
    
    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }
    
    public Long getTimestamp() { return timestamp; }
    public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }
}
