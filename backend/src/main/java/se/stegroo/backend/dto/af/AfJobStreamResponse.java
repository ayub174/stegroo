package se.stegroo.backend.dto.af;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

/**
 * DTO för svar från Arbetsförmedlingens Jobstream API.
 * Baserat på https://jobstream.api.jobtechdev.se/
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AfJobStreamResponse {

    private List<AfJobAd> ads;
    private String next;
    private String expired;
    private String removed;

    public AfJobStreamResponse() {
    }

    public AfJobStreamResponse(List<AfJobAd> ads, String next, String expired, String removed) {
        this.ads = ads;
        this.next = next;
        this.expired = expired;
        this.removed = removed;
    }

    public List<AfJobAd> getAds() {
        return ads;
    }

    public void setAds(List<AfJobAd> ads) {
        this.ads = ads;
    }

    public String getNext() {
        return next;
    }

    public void setNext(String next) {
        this.next = next;
    }

    public String getExpired() {
        return expired;
    }

    public void setExpired(String expired) {
        this.expired = expired;
    }

    public String getRemoved() {
        return removed;
    }

    public void setRemoved(String removed) {
        this.removed = removed;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AfJobStreamResponse that = (AfJobStreamResponse) o;
        return Objects.equals(ads, that.ads) &&
                Objects.equals(next, that.next) &&
                Objects.equals(expired, that.expired) &&
                Objects.equals(removed, that.removed);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ads, next, expired, removed);
    }

    @Override
    public String toString() {
        return "AfJobStreamResponse{" +
                "ads=" + ads +
                ", next='" + next + '\'' +
                ", expired='" + expired + '\'' +
                ", removed='" + removed + '\'' +
                '}';
    }

    /**
     * Representerar en jobbannons från Arbetsförmedlingens Jobstream API
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AfJobAd {
        private String id;
        
        @JsonProperty("external_id")
        private String externalId;
        
        @JsonProperty("webpage_url")
        private AfWebpageUrl webpageUrl;
        
        @JsonProperty("logo_url")
        private String logoUrl;
        
        private String headline;
        
        private AfApplication application;
        
        private AfEmployer employer;
        
        @JsonProperty("application_deadline")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
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
        
        @JsonProperty("duration")
        private AfTaxonomy duration;
        
        @JsonProperty("working_hours_type")
        private AfTaxonomy workingHoursType;
        
        @JsonProperty("scope_of_work")
        private AfScopeOfWork scopeOfWork;
        
        private List<AfTaxonomy> occupation;
        
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
        
        @JsonProperty("driving_license_required")
        private Boolean drivingLicenseRequired;
        
        @JsonProperty("driving_license")
        private List<AfTaxonomy> drivingLicense;
        
        @JsonProperty("publication_date")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime publicationDate;
        
        @JsonProperty("last_publication_date")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime lastPublicationDate;
        
        @JsonProperty("removed")
        private Boolean removed;
        
        @JsonProperty("removed_date")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime removedDate;
        
        @JsonProperty("source_type")
        private String sourceType;
        
        @JsonProperty("timestamp")
        private Long timestamp;
        
        public AfJobAd() {
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getExternalId() {
            return externalId;
        }

        public void setExternalId(String externalId) {
            this.externalId = externalId;
        }

        public AfWebpageUrl getWebpageUrl() {
            return webpageUrl;
        }

        public void setWebpageUrl(AfWebpageUrl webpageUrl) {
            this.webpageUrl = webpageUrl;
        }

        public String getLogoUrl() {
            return logoUrl;
        }

        public void setLogoUrl(String logoUrl) {
            this.logoUrl = logoUrl;
        }

        public String getHeadline() {
            return headline;
        }

        public void setHeadline(String headline) {
            this.headline = headline;
        }

        public AfApplication getApplication() {
            return application;
        }

        public void setApplication(AfApplication application) {
            this.application = application;
        }

        public AfEmployer getEmployer() {
            return employer;
        }

        public void setEmployer(AfEmployer employer) {
            this.employer = employer;
        }

        public LocalDateTime getApplicationDeadline() {
            return applicationDeadline;
        }

        public void setApplicationDeadline(LocalDateTime applicationDeadline) {
            this.applicationDeadline = applicationDeadline;
        }

        public Integer getNumberOfVacancies() {
            return numberOfVacancies;
        }

        public void setNumberOfVacancies(Integer numberOfVacancies) {
            this.numberOfVacancies = numberOfVacancies;
        }

        public AfDescription getDescription() {
            return description;
        }

        public void setDescription(AfDescription description) {
            this.description = description;
        }

        public AfTaxonomy getEmploymentType() {
            return employmentType;
        }

        public void setEmploymentType(AfTaxonomy employmentType) {
            this.employmentType = employmentType;
        }

        public AfTaxonomy getSalaryType() {
            return salaryType;
        }

        public void setSalaryType(AfTaxonomy salaryType) {
            this.salaryType = salaryType;
        }

        public String getSalaryDescription() {
            return salaryDescription;
        }

        public void setSalaryDescription(String salaryDescription) {
            this.salaryDescription = salaryDescription;
        }

        public AfTaxonomy getDuration() {
            return duration;
        }

        public void setDuration(AfTaxonomy duration) {
            this.duration = duration;
        }

        public AfTaxonomy getWorkingHoursType() {
            return workingHoursType;
        }

        public void setWorkingHoursType(AfTaxonomy workingHoursType) {
            this.workingHoursType = workingHoursType;
        }

        public AfScopeOfWork getScopeOfWork() {
            return scopeOfWork;
        }

        public void setScopeOfWork(AfScopeOfWork scopeOfWork) {
            this.scopeOfWork = scopeOfWork;
        }

        public List<AfTaxonomy> getOccupation() {
            return occupation;
        }

        public void setOccupation(List<AfTaxonomy> occupation) {
            this.occupation = occupation;
        }

        public AfTaxonomy getOccupationGroup() {
            return occupationGroup;
        }

        public void setOccupationGroup(AfTaxonomy occupationGroup) {
            this.occupationGroup = occupationGroup;
        }

        public AfTaxonomy getOccupationField() {
            return occupationField;
        }

        public void setOccupationField(AfTaxonomy occupationField) {
            this.occupationField = occupationField;
        }

        public AfWorkplaceAddress getWorkplaceAddress() {
            return workplaceAddress;
        }

        public void setWorkplaceAddress(AfWorkplaceAddress workplaceAddress) {
            this.workplaceAddress = workplaceAddress;
        }

        public AfRequirements getMustHave() {
            return mustHave;
        }

        public void setMustHave(AfRequirements mustHave) {
            this.mustHave = mustHave;
        }

        public AfRequirements getNiceToHave() {
            return niceToHave;
        }

        public void setNiceToHave(AfRequirements niceToHave) {
            this.niceToHave = niceToHave;
        }

        public Boolean getDrivingLicenseRequired() {
            return drivingLicenseRequired;
        }

        public void setDrivingLicenseRequired(Boolean drivingLicenseRequired) {
            this.drivingLicenseRequired = drivingLicenseRequired;
        }

        public List<AfTaxonomy> getDrivingLicense() {
            return drivingLicense;
        }

        public void setDrivingLicense(List<AfTaxonomy> drivingLicense) {
            this.drivingLicense = drivingLicense;
        }

        public LocalDateTime getPublicationDate() {
            return publicationDate;
        }

        public void setPublicationDate(LocalDateTime publicationDate) {
            this.publicationDate = publicationDate;
        }

        public LocalDateTime getLastPublicationDate() {
            return lastPublicationDate;
        }

        public void setLastPublicationDate(LocalDateTime lastPublicationDate) {
            this.lastPublicationDate = lastPublicationDate;
        }

        public Boolean getRemoved() {
            return removed;
        }

        public void setRemoved(Boolean removed) {
            this.removed = removed;
        }

        public LocalDateTime getRemovedDate() {
            return removedDate;
        }

        public void setRemovedDate(LocalDateTime removedDate) {
            this.removedDate = removedDate;
        }

        public String getSourceType() {
            return sourceType;
        }

        public void setSourceType(String sourceType) {
            this.sourceType = sourceType;
        }

        public Long getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(Long timestamp) {
            this.timestamp = timestamp;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            AfJobAd afJobAd = (AfJobAd) o;
            return Objects.equals(id, afJobAd.id);
        }

        @Override
        public int hashCode() {
            return Objects.hash(id);
        }
    }

    /**
     * Representerar en webbadress för en jobbannons
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AfWebpageUrl {
        private String url;

        public AfWebpageUrl() {
        }

        public AfWebpageUrl(String url) {
            this.url = url;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            AfWebpageUrl that = (AfWebpageUrl) o;
            return Objects.equals(url, that.url);
        }

        @Override
        public int hashCode() {
            return Objects.hash(url);
        }
    }

    /**
     * Representerar ansökningsdetaljer för en jobbannons
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AfApplication {
        private String url;
        private String email;
        private Boolean via_af;
        private List<AfContact> contacts;

        public AfApplication() {
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public Boolean getVia_af() {
            return via_af;
        }

        public void setVia_af(Boolean via_af) {
            this.via_af = via_af;
        }

        public List<AfContact> getContacts() {
            return contacts;
        }

        public void setContacts(List<AfContact> contacts) {
            this.contacts = contacts;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            AfApplication that = (AfApplication) o;
            return Objects.equals(url, that.url) &&
                    Objects.equals(email, that.email) &&
                    Objects.equals(via_af, that.via_af) &&
                    Objects.equals(contacts, that.contacts);
        }

        @Override
        public int hashCode() {
            return Objects.hash(url, email, via_af, contacts);
        }
    }

    /**
     * Representerar en kontaktperson för en jobbannons
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AfContact {
        private String name;
        private String description;
        private String email;
        private String telephone;
        @JsonProperty("contact_type")
        private String contactType;

        public AfContact() {
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getTelephone() {
            return telephone;
        }

        public void setTelephone(String telephone) {
            this.telephone = telephone;
        }

        public String getContactType() {
            return contactType;
        }

        public void setContactType(String contactType) {
            this.contactType = contactType;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            AfContact afContact = (AfContact) o;
            return Objects.equals(name, afContact.name) &&
                    Objects.equals(email, afContact.email) &&
                    Objects.equals(telephone, afContact.telephone);
        }

        @Override
        public int hashCode() {
            return Objects.hash(name, email, telephone);
        }
    }

    /**
     * Representerar en arbetsgivare för en jobbannons
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AfEmployer {
        private String name;
        @JsonProperty("organization_number")
        private String organizationNumber;
        private String url;
        @JsonProperty("phone_number")
        private String phoneNumber;
        private String email;
        private String workplace;

        public AfEmployer() {
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getOrganizationNumber() {
            return organizationNumber;
        }

        public void setOrganizationNumber(String organizationNumber) {
            this.organizationNumber = organizationNumber;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getWorkplace() {
            return workplace;
        }

        public void setWorkplace(String workplace) {
            this.workplace = workplace;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            AfEmployer that = (AfEmployer) o;
            return Objects.equals(name, that.name) &&
                    Objects.equals(organizationNumber, that.organizationNumber);
        }

        @Override
        public int hashCode() {
            return Objects.hash(name, organizationNumber);
        }
    }

    /**
     * Representerar beskrivningen av en jobbannons
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AfDescription {
        private String text;
        @JsonProperty("text_formatted")
        private String textFormatted;
        @JsonProperty("company_information")
        private String companyInformation;
        private String needs;
        private String requirements;
        private String conditions;

        public AfDescription() {
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public String getTextFormatted() {
            return textFormatted;
        }

        public void setTextFormatted(String textFormatted) {
            this.textFormatted = textFormatted;
        }

        public String getCompanyInformation() {
            return companyInformation;
        }

        public void setCompanyInformation(String companyInformation) {
            this.companyInformation = companyInformation;
        }

        public String getNeeds() {
            return needs;
        }

        public void setNeeds(String needs) {
            this.needs = needs;
        }

        public String getRequirements() {
            return requirements;
        }

        public void setRequirements(String requirements) {
            this.requirements = requirements;
        }

        public String getConditions() {
            return conditions;
        }

        public void setConditions(String conditions) {
            this.conditions = conditions;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            AfDescription that = (AfDescription) o;
            return Objects.equals(text, that.text);
        }

        @Override
        public int hashCode() {
            return Objects.hash(text);
        }
    }

    /**
     * Representerar taxonomi-information (koncept) från Arbetsförmedlingen
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AfTaxonomy {
        @JsonProperty("concept_id")
        private String conceptId;
        private String label;
        @JsonProperty("legacy_ams_taxonomy_id")
        private String legacyAmsTaxonomyId;

        public AfTaxonomy() {
        }

        public String getConceptId() {
            return conceptId;
        }

        public void setConceptId(String conceptId) {
            this.conceptId = conceptId;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public String getLegacyAmsTaxonomyId() {
            return legacyAmsTaxonomyId;
        }

        public void setLegacyAmsTaxonomyId(String legacyAmsTaxonomyId) {
            this.legacyAmsTaxonomyId = legacyAmsTaxonomyId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            AfTaxonomy that = (AfTaxonomy) o;
            return Objects.equals(conceptId, that.conceptId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(conceptId);
        }
    }

    /**
     * Representerar omfattningen av arbetet
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AfScopeOfWork {
        private Integer min;
        private Integer max;

        public AfScopeOfWork() {
        }

        public Integer getMin() {
            return min;
        }

        public void setMin(Integer min) {
            this.min = min;
        }

        public Integer getMax() {
            return max;
        }

        public void setMax(Integer max) {
            this.max = max;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            AfScopeOfWork that = (AfScopeOfWork) o;
            return Objects.equals(min, that.min) &&
                    Objects.equals(max, that.max);
        }

        @Override
        public int hashCode() {
            return Objects.hash(min, max);
        }
    }

    /**
     * Representerar adressinformation för arbetsplatsen
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AfWorkplaceAddress {
        private String municipality;
        @JsonProperty("municipality_code")
        private String municipalityCode;
        @JsonProperty("municipality_concept_id")
        private String municipalityConceptId;
        private String region;
        @JsonProperty("region_code")
        private String regionCode;
        @JsonProperty("region_concept_id")
        private String regionConceptId;
        private String country;
        @JsonProperty("country_code")
        private String countryCode;
        @JsonProperty("country_concept_id")
        private String countryConceptId;
        @JsonProperty("street_address")
        private String streetAddress;
        private String postcode;
        private String city;
        private List<Double> coordinates;

        public AfWorkplaceAddress() {
        }

        public String getMunicipality() {
            return municipality;
        }

        public void setMunicipality(String municipality) {
            this.municipality = municipality;
        }

        public String getMunicipalityCode() {
            return municipalityCode;
        }

        public void setMunicipalityCode(String municipalityCode) {
            this.municipalityCode = municipalityCode;
        }

        public String getMunicipalityConceptId() {
            return municipalityConceptId;
        }

        public void setMunicipalityConceptId(String municipalityConceptId) {
            this.municipalityConceptId = municipalityConceptId;
        }

        public String getRegion() {
            return region;
        }

        public void setRegion(String region) {
            this.region = region;
        }

        public String getRegionCode() {
            return regionCode;
        }

        public void setRegionCode(String regionCode) {
            this.regionCode = regionCode;
        }

        public String getRegionConceptId() {
            return regionConceptId;
        }

        public void setRegionConceptId(String regionConceptId) {
            this.regionConceptId = regionConceptId;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public String getCountryCode() {
            return countryCode;
        }

        public void setCountryCode(String countryCode) {
            this.countryCode = countryCode;
        }

        public String getCountryConceptId() {
            return countryConceptId;
        }

        public void setCountryConceptId(String countryConceptId) {
            this.countryConceptId = countryConceptId;
        }

        public String getStreetAddress() {
            return streetAddress;
        }

        public void setStreetAddress(String streetAddress) {
            this.streetAddress = streetAddress;
        }

        public String getPostcode() {
            return postcode;
        }

        public void setPostcode(String postcode) {
            this.postcode = postcode;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public List<Double> getCoordinates() {
            return coordinates;
        }

        public void setCoordinates(List<Double> coordinates) {
            this.coordinates = coordinates;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            AfWorkplaceAddress that = (AfWorkplaceAddress) o;
            return Objects.equals(municipality, that.municipality) &&
                    Objects.equals(region, that.region) &&
                    Objects.equals(country, that.country);
        }

        @Override
        public int hashCode() {
            return Objects.hash(municipality, region, country);
        }
    }

    /**
     * Representerar krav eller önskvärda egenskaper för en jobbannons
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AfRequirements {
        private List<AfTaxonomy> skills;
        private List<AfTaxonomy> languages;
        @JsonProperty("work_experiences")
        private List<AfWorkExperience> workExperiences;
        private List<AfTaxonomy> education;
        @JsonProperty("education_level")
        private List<AfTaxonomy> educationLevel;

        public AfRequirements() {
        }

        public List<AfTaxonomy> getSkills() {
            return skills;
        }

        public void setSkills(List<AfTaxonomy> skills) {
            this.skills = skills;
        }

        public List<AfTaxonomy> getLanguages() {
            return languages;
        }

        public void setLanguages(List<AfTaxonomy> languages) {
            this.languages = languages;
        }

        public List<AfWorkExperience> getWorkExperiences() {
            return workExperiences;
        }

        public void setWorkExperiences(List<AfWorkExperience> workExperiences) {
            this.workExperiences = workExperiences;
        }

        public List<AfTaxonomy> getEducation() {
            return education;
        }

        public void setEducation(List<AfTaxonomy> education) {
            this.education = education;
        }

        public List<AfTaxonomy> getEducationLevel() {
            return educationLevel;
        }

        public void setEducationLevel(List<AfTaxonomy> educationLevel) {
            this.educationLevel = educationLevel;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            AfRequirements that = (AfRequirements) o;
            return Objects.equals(skills, that.skills) &&
                    Objects.equals(languages, that.languages) &&
                    Objects.equals(workExperiences, that.workExperiences);
        }

        @Override
        public int hashCode() {
            return Objects.hash(skills, languages, workExperiences);
        }
    }

    /**
     * Representerar arbetserfarenhet för en jobbannons
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AfWorkExperience extends AfTaxonomy {
        private Integer weight;
        private Integer years;

        public AfWorkExperience() {
        }

        public Integer getWeight() {
            return weight;
        }

        public void setWeight(Integer weight) {
            this.weight = weight;
        }

        public Integer getYears() {
            return years;
        }

        public void setYears(Integer years) {
            this.years = years;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            if (!super.equals(o)) return false;
            AfWorkExperience that = (AfWorkExperience) o;
            return Objects.equals(weight, that.weight) &&
                    Objects.equals(years, that.years);
        }

        @Override
        public int hashCode() {
            return Objects.hash(super.hashCode(), weight, years);
        }
    }
}
