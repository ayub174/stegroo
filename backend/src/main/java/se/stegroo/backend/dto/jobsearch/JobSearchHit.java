package se.stegroo.backend.dto.jobsearch;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Enskilt jobb från JobSearch API:s sökresultat
 */
public class JobSearchHit {
    
    @JsonProperty("id")
    private String id;
    
    @JsonProperty("external_id")
    private String externalId;
    
    @JsonProperty("original_id")
    private String originalId;
    
    @JsonProperty("headline")
    private String headline;
    
    @JsonProperty("description")
    private JobDescription description;
    
    @JsonProperty("employer")
    private Employer employer;
    
    @JsonProperty("workplace_address")
    private WorkplaceAddress workplaceAddress;
    
    @JsonProperty("application_deadline")
    private LocalDateTime applicationDeadline;
    
    @JsonProperty("publication_date")
    private LocalDateTime publicationDate;
    
    @JsonProperty("last_publication_date")
    private LocalDateTime lastPublicationDate;
    
    @JsonProperty("employment_type")
    private TaxonomyItem employmentType;
    
    @JsonProperty("working_hours_type")
    private TaxonomyItem workingHoursType;
    
    @JsonProperty("duration")
    private TaxonomyItem duration;
    
    @JsonProperty("scope_of_work")
    private ScopeOfWork scopeOfWork;
    
    @JsonProperty("occupation")
    private TaxonomyItem occupation;
    
    @JsonProperty("occupation_group")
    private TaxonomyItem occupationGroup;
    
    @JsonProperty("occupation_field")
    private TaxonomyItem occupationField;
    
    @JsonProperty("salary_type")
    private TaxonomyItem salaryType;
    
    @JsonProperty("salary_description")
    private String salaryDescription;
    
    @JsonProperty("number_of_vacancies")
    private Integer numberOfVacancies;
    
    @JsonProperty("experience_required")
    private Boolean experienceRequired;
    
    @JsonProperty("driving_license_required")
    private Boolean drivingLicenseRequired;
    
    @JsonProperty("driving_license")
    private List<TaxonomyItem> drivingLicense;
    
    @JsonProperty("access_to_own_car")
    private Boolean accessToOwnCar;
    
    @JsonProperty("application_details")
    private ApplicationDetails applicationDetails;
    
    @JsonProperty("must_have")
    private Requirements mustHave;
    
    @JsonProperty("nice_to_have")
    private Requirements niceToHave;
    
    @JsonProperty("webpage_url")
    private Object webpageUrl;
    
    @JsonProperty("logo_url")
    private String logoUrl;
    
    @JsonProperty("removed")
    private Boolean removed;
    
    @JsonProperty("removed_date")
    private LocalDateTime removedDate;
    
    @JsonProperty("source_type")
    private String sourceType;
    
    @JsonProperty("timestamp")
    private Long timestamp;
    
    @JsonProperty("relevance")
    private Double relevance;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getExternalId() { return externalId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }
    
    public String getOriginalId() { return originalId; }
    public void setOriginalId(String originalId) { this.originalId = originalId; }
    
    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }
    
    public JobDescription getDescription() { return description; }
    public void setDescription(JobDescription description) { this.description = description; }
    
    public Employer getEmployer() { return employer; }
    public void setEmployer(Employer employer) { this.employer = employer; }
    
    public WorkplaceAddress getWorkplaceAddress() { return workplaceAddress; }
    public void setWorkplaceAddress(WorkplaceAddress workplaceAddress) { this.workplaceAddress = workplaceAddress; }
    
    public LocalDateTime getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDateTime applicationDeadline) { this.applicationDeadline = applicationDeadline; }
    
    public LocalDateTime getPublicationDate() { return publicationDate; }
    public void setPublicationDate(LocalDateTime publicationDate) { this.publicationDate = publicationDate; }
    
    public LocalDateTime getLastPublicationDate() { return lastPublicationDate; }
    public void setLastPublicationDate(LocalDateTime lastPublicationDate) { this.lastPublicationDate = lastPublicationDate; }
    
    public TaxonomyItem getEmploymentType() { return employmentType; }
    public void setEmploymentType(TaxonomyItem employmentType) { this.employmentType = employmentType; }
    
    public TaxonomyItem getWorkingHoursType() { return workingHoursType; }
    public void setWorkingHoursType(TaxonomyItem workingHoursType) { this.workingHoursType = workingHoursType; }
    
    public TaxonomyItem getDuration() { return duration; }
    public void setDuration(TaxonomyItem duration) { this.duration = duration; }
    
    public ScopeOfWork getScopeOfWork() { return scopeOfWork; }
    public void setScopeOfWork(ScopeOfWork scopeOfWork) { this.scopeOfWork = scopeOfWork; }
    
    public TaxonomyItem getOccupation() { return occupation; }
    public void setOccupation(TaxonomyItem occupation) { this.occupation = occupation; }
    
    public TaxonomyItem getOccupationGroup() { return occupationGroup; }
    public void setOccupationGroup(TaxonomyItem occupationGroup) { this.occupationGroup = occupationGroup; }
    
    public TaxonomyItem getOccupationField() { return occupationField; }
    public void setOccupationField(TaxonomyItem occupationField) { this.occupationField = occupationField; }
    
    public TaxonomyItem getSalaryType() { return salaryType; }
    public void setSalaryType(TaxonomyItem salaryType) { this.salaryType = salaryType; }
    
    public String getSalaryDescription() { return salaryDescription; }
    public void setSalaryDescription(String salaryDescription) { this.salaryDescription = salaryDescription; }
    
    public Integer getNumberOfVacancies() { return numberOfVacancies; }
    public void setNumberOfVacancies(Integer numberOfVacancies) { this.numberOfVacancies = numberOfVacancies; }
    
    public Boolean getExperienceRequired() { return experienceRequired; }
    public void setExperienceRequired(Boolean experienceRequired) { this.experienceRequired = experienceRequired; }
    
    public Boolean getDrivingLicenseRequired() { return drivingLicenseRequired; }
    public void setDrivingLicenseRequired(Boolean drivingLicenseRequired) { this.drivingLicenseRequired = drivingLicenseRequired; }
    
    public List<TaxonomyItem> getDrivingLicense() { return drivingLicense; }
    public void setDrivingLicense(List<TaxonomyItem> drivingLicense) { this.drivingLicense = drivingLicense; }
    
    public Boolean getAccessToOwnCar() { return accessToOwnCar; }
    public void setAccessToOwnCar(Boolean accessToOwnCar) { this.accessToOwnCar = accessToOwnCar; }
    
    public ApplicationDetails getApplicationDetails() { return applicationDetails; }
    public void setApplicationDetails(ApplicationDetails applicationDetails) { this.applicationDetails = applicationDetails; }
    
    public Requirements getMustHave() { return mustHave; }
    public void setMustHave(Requirements mustHave) { this.mustHave = mustHave; }
    
    public Requirements getNiceToHave() { return niceToHave; }
    public void setNiceToHave(Requirements niceToHave) { this.niceToHave = niceToHave; }
    
    public Object getWebpageUrl() { return webpageUrl; }
    public void setWebpageUrl(Object webpageUrl) { this.webpageUrl = webpageUrl; }
    
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    
    public Boolean getRemoved() { return removed; }
    public void setRemoved(Boolean removed) { this.removed = removed; }
    
    public LocalDateTime getRemovedDate() { return removedDate; }
    public void setRemovedDate(LocalDateTime removedDate) { this.removedDate = removedDate; }
    
    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }
    
    public Long getTimestamp() { return timestamp; }
    public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }
    
    public Double getRelevance() { return relevance; }
    public void setRelevance(Double relevance) { this.relevance = relevance; }
}
