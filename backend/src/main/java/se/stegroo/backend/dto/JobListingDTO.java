package se.stegroo.backend.dto;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO för jobbannons till frontend.
 */
public class JobListingDTO {

    private Long id;
    private String title;
    private String description;
    private String companyName;
    private String location;
    private String externalId;
    private String externalUrl;
    private String source;
    private String employmentType;
    private LocalDateTime publishedAt;
    private LocalDateTime deadline;
    private LocalDateTime lastModified;
    private LocalDateTime createdAt;
    
    private CategoryDTO category;
    private Set<SkillDTO> skills;
    
    public JobListingDTO() {
    }
    
    public JobListingDTO(Long id, String title, String description, String companyName, String location,
                        String externalId, String externalUrl, String source, String employmentType,
                        LocalDateTime publishedAt, LocalDateTime deadline, LocalDateTime lastModified,
                        LocalDateTime createdAt, CategoryDTO category, Set<SkillDTO> skills) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.companyName = companyName;
        this.location = location;
        this.externalId = externalId;
        this.externalUrl = externalUrl;
        this.source = source;
        this.employmentType = employmentType;
        this.publishedAt = publishedAt;
        this.deadline = deadline;
        this.lastModified = lastModified;
        this.createdAt = createdAt;
        this.category = category;
        this.skills = skills;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getCompanyName() {
        return companyName;
    }
    
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getExternalId() {
        return externalId;
    }
    
    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }
    
    public String getExternalUrl() {
        return externalUrl;
    }
    
    public void setExternalUrl(String externalUrl) {
        this.externalUrl = externalUrl;
    }
    
    public String getSource() {
        return source;
    }
    
    public void setSource(String source) {
        this.source = source;
    }
    
    public String getEmploymentType() {
        return employmentType;
    }
    
    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }
    
    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }
    
    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }
    
    public LocalDateTime getDeadline() {
        return deadline;
    }
    
    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }
    
    public LocalDateTime getLastModified() {
        return lastModified;
    }
    
    public void setLastModified(LocalDateTime lastModified) {
        this.lastModified = lastModified;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public CategoryDTO getCategory() {
        return category;
    }
    
    public void setCategory(CategoryDTO category) {
        this.category = category;
    }
    
    public Set<SkillDTO> getSkills() {
        return skills;
    }
    
    public void setSkills(Set<SkillDTO> skills) {
        this.skills = skills;
    }
    
    public static JobListingDTOBuilder builder() {
        return new JobListingDTOBuilder();
    }
    
    /**
     * DTO för kategori.
     */
    public static class CategoryDTO {
        private Long id;
        private String name;
        
        public CategoryDTO() {
        }
        
        public CategoryDTO(Long id, String name) {
            this.id = id;
            this.name = name;
        }
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public static CategoryDTOBuilder builder() {
            return new CategoryDTOBuilder();
        }
        
        public static class CategoryDTOBuilder {
            private Long id;
            private String name;
            
            public CategoryDTOBuilder id(Long id) {
                this.id = id;
                return this;
            }
            
            public CategoryDTOBuilder name(String name) {
                this.name = name;
                return this;
            }
            
            public CategoryDTO build() {
                return new CategoryDTO(id, name);
            }
        }
    }
    
    /**
     * DTO för kompetens.
     */
    public static class SkillDTO {
        private Long id;
        private String name;
        
        public SkillDTO() {
        }
        
        public SkillDTO(Long id, String name) {
            this.id = id;
            this.name = name;
        }
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public static SkillDTOBuilder builder() {
            return new SkillDTOBuilder();
        }
        
        public static class SkillDTOBuilder {
            private Long id;
            private String name;
            
            public SkillDTOBuilder id(Long id) {
                this.id = id;
                return this;
            }
            
            public SkillDTOBuilder name(String name) {
                this.name = name;
                return this;
            }
            
            public SkillDTO build() {
                return new SkillDTO(id, name);
            }
        }
    }
    
    public static class JobListingDTOBuilder {
        private Long id;
        private String title;
        private String description;
        private String companyName;
        private String location;
        private String externalId;
        private String externalUrl;
        private String source;
        private String employmentType;
        private LocalDateTime publishedAt;
        private LocalDateTime deadline;
        private LocalDateTime lastModified;
        private LocalDateTime createdAt;
        private CategoryDTO category;
        private Set<SkillDTO> skills;
        
        public JobListingDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public JobListingDTOBuilder title(String title) {
            this.title = title;
            return this;
        }
        
        public JobListingDTOBuilder description(String description) {
            this.description = description;
            return this;
        }
        
        public JobListingDTOBuilder companyName(String companyName) {
            this.companyName = companyName;
            return this;
        }
        
        public JobListingDTOBuilder location(String location) {
            this.location = location;
            return this;
        }
        
        public JobListingDTOBuilder externalId(String externalId) {
            this.externalId = externalId;
            return this;
        }
        
        public JobListingDTOBuilder externalUrl(String externalUrl) {
            this.externalUrl = externalUrl;
            return this;
        }
        
        public JobListingDTOBuilder source(String source) {
            this.source = source;
            return this;
        }
        
        public JobListingDTOBuilder employmentType(String employmentType) {
            this.employmentType = employmentType;
            return this;
        }
        
        public JobListingDTOBuilder publishedAt(LocalDateTime publishedAt) {
            this.publishedAt = publishedAt;
            return this;
        }
        
        public JobListingDTOBuilder deadline(LocalDateTime deadline) {
            this.deadline = deadline;
            return this;
        }
        
        public JobListingDTOBuilder lastModified(LocalDateTime lastModified) {
            this.lastModified = lastModified;
            return this;
        }
        
        public JobListingDTOBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        public JobListingDTOBuilder category(CategoryDTO category) {
            this.category = category;
            return this;
        }
        
        public JobListingDTOBuilder skills(Set<SkillDTO> skills) {
            this.skills = skills;
            return this;
        }
        
        public JobListingDTO build() {
            return new JobListingDTO(id, title, description, companyName, location, externalId, externalUrl,
                                   source, employmentType, publishedAt, deadline, lastModified,
                                   createdAt, category, skills);
        }
    }
}