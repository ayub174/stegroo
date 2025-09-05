package se.stegroo.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * Entitet som representerar en jobbkategori.
 * Kategorier kan vara hierarkiska med förälder-barn-relationer.
 * Stöder taxonomi-synkronisering med Arbetsförmedlingens system.
 */
@Entity
@Table(name = "job_categories")
public class JobCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    /**
     * Extern ID från Arbetsförmedlingens taxonomi
     */
    @Column(name = "external_id")
    private String externalId;

    /**
     * Legacy AMS taxonomy ID för bakåtkompatibilitet
     */
    @Column(name = "legacy_ams_taxonomy_id")
    private String legacyAmsTaxonomyId;

    /**
     * Taxonomi-typ (occupation, skill, employment_type, etc.)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "taxonomy_type")
    private TaxonomyType taxonomyType = TaxonomyType.OCCUPATION;

    /**
     * Hierarkinivå (0 = root, 1 = första nivå, etc.)
     */
    @Column(name = "hierarchy_level")
    private Integer hierarchyLevel = 0;

    /**
     * Sökväg i hierarkin (t.ex. "IT/Utveckling/Java")
     */
    @Column(name = "hierarchy_path", length = 500)
    private String hierarchyPath;

    /**
     * Om kategorin är aktiv (false = inaktiverad/ersatt)
     */
    @Column(name = "is_active")
    private Boolean isActive = true;

    /**
     * Senaste synkronisering med extern taxonomi
     */
    @Column(name = "last_sync_at")
    private LocalDateTime lastSyncAt;

    /**
     * Förälderkategori (null för toppnivåkategorier)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private JobCategory parent;

    /**
     * Underkategorier
     */
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private Set<JobCategory> children = new HashSet<>();

    /**
     * Jobb i denna kategori
     */
    @OneToMany(mappedBy = "category")
    private Set<JobListing> jobs = new HashSet<>();
    
    /**
     * När kategorin skapades
     */
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    /**
     * När kategorin senast uppdaterades
     */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Enum för olika typer av taxonomi
     */
    public enum TaxonomyType {
        OCCUPATION,      // Yrkeskategorier
        SKILL,          // Kompetenser
        EMPLOYMENT_TYPE, // Anställningstyper
        WORKING_HOURS,   // Arbetstidstyper
        LOCATION,        // Platskategorier
        INDUSTRY         // Branschkategorier
    }
    
    public JobCategory() {
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
        updateHierarchyInfo();
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getExternalId() {
        return externalId;
    }
    
    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getLegacyAmsTaxonomyId() {
        return legacyAmsTaxonomyId;
    }

    public void setLegacyAmsTaxonomyId(String legacyAmsTaxonomyId) {
        this.legacyAmsTaxonomyId = legacyAmsTaxonomyId;
    }

    public TaxonomyType getTaxonomyType() {
        return taxonomyType;
    }

    public void setTaxonomyType(TaxonomyType taxonomyType) {
        this.taxonomyType = taxonomyType;
    }

    public Integer getHierarchyLevel() {
        return hierarchyLevel;
    }

    public void setHierarchyLevel(Integer hierarchyLevel) {
        this.hierarchyLevel = hierarchyLevel;
    }

    public String getHierarchyPath() {
        return hierarchyPath;
    }

    public void setHierarchyPath(String hierarchyPath) {
        this.hierarchyPath = hierarchyPath;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getLastSyncAt() {
        return lastSyncAt;
    }

    public void setLastSyncAt(LocalDateTime lastSyncAt) {
        this.lastSyncAt = lastSyncAt;
    }
    
    public JobCategory getParent() {
        return parent;
    }
    
    public void setParent(JobCategory parent) {
        this.parent = parent;
        updateHierarchyInfo();
    }
    
    public Set<JobCategory> getChildren() {
        return children;
    }
    
    public void setChildren(Set<JobCategory> children) {
        this.children = children;
    }
    
    public Set<JobListing> getJobs() {
        return jobs;
    }
    
    public void setJobs(Set<JobListing> jobs) {
        this.jobs = jobs;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    /**
     * Uppdaterar hierarkiinformation baserat på förälder
     */
    private void updateHierarchyInfo() {
        if (this.parent != null) {
            this.hierarchyLevel = this.parent.getHierarchyLevel() + 1;
            this.hierarchyPath = this.parent.getHierarchyPath() + "/" + this.name;
        } else {
            this.hierarchyLevel = 0;
            this.hierarchyPath = this.name;
        }
    }

    /**
     * Lägger till en underkategori
     */
    public void addChild(JobCategory child) {
        this.children.add(child);
        child.setParent(this);
    }

    /**
     * Tar bort en underkategori
     */
    public void removeChild(JobCategory child) {
        this.children.remove(child);
        if (child.getParent() == this) {
            child.setParent(null);
        }
    }

    /**
     * Kontrollerar om kategorin är en rotkategori
     */
    public boolean isRoot() {
        return this.parent == null;
    }

    /**
     * Kontrollerar om kategorin är en bladkategori (inga barn)
     */
    public boolean isLeaf() {
        return this.children.isEmpty();
    }

    /**
     * Hämtar alla föräldrar upp till roten
     */
    public List<JobCategory> getAncestors() {
        List<JobCategory> ancestors = new ArrayList<>();
        JobCategory current = this.parent;
        while (current != null) {
            ancestors.add(0, current); // Lägg till i början för att behålla ordning
            current = current.getParent();
        }
        return ancestors;
    }

    /**
     * Hämtar alla barn rekursivt
     */
    public List<JobCategory> getAllDescendants() {
        List<JobCategory> descendants = new ArrayList<>();
        for (JobCategory child : this.children) {
            descendants.add(child);
            descendants.addAll(child.getAllDescendants());
        }
        return descendants;
    }

    /**
     * Uppdaterar synkroniseringsinformation
     */
    public void updateSyncInfo() {
        this.lastSyncAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Kontrollerar om kategorin behöver synkroniseras
     */
    public boolean needsSync() {
        return this.lastSyncAt == null || 
               this.lastSyncAt.isBefore(LocalDateTime.now().minusDays(1));
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        JobCategory that = (JobCategory) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
