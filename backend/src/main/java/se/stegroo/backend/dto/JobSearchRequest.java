package se.stegroo.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import se.stegroo.backend.model.JobListing;

import java.util.List;
import java.util.Objects;
import java.util.Set;

@Schema(description = "Request för jobbsökning med avancerad filtrering")
public class JobSearchRequest {

    @Schema(description = "Sökfras för fulltext-sökning i title och description")
    private String query;

    @Schema(description = "Plats för jobbet (stad, kommun, etc.)")
    private String location;

    @Schema(description = "ID för jobbkategori")
    private Long categoryId;

    @Schema(description = "Lista med ID:n för kompetenser")
    private Set<Long> skillIds;

    @Schema(description = "Anställningstyp (heltid, deltid, etc.)")
    private String employmentType;

    @Schema(description = "Arbetstid (dag, natt, skift, etc.)")
    private String workingHoursType;

    @Schema(description = "Jobbets status (ACTIVE, EXPIRED, REMOVED)")
    private JobListing.Status status;

    @Schema(description = "Antal dagar tillbaka att söka i")
    private Integer daysBack;

    @Schema(description = "Minsta lön")
    private Integer minSalary;

    @Schema(description = "Högsta lön")
    private Integer maxSalary;

    @Schema(description = "Sidnummer (0-baserat)")
    private Integer page = 0;

    @Schema(description = "Antal resultat per sida")
    private Integer size = 20;

    @Schema(description = "Fält att sortera på")
    private String sortBy = "createdAt";

    @Schema(description = "Sorteringsriktning (asc eller desc)")
    private String sortDirection = "desc";

    // Konstruktorer
    public JobSearchRequest() {}

    public JobSearchRequest(String query, String location, Long categoryId) {
        this.query = query;
        this.location = location;
        this.categoryId = categoryId;
    }

    // Getters och Setters
    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Set<Long> getSkillIds() {
        return skillIds != null ? new java.util.HashSet<>(skillIds) : null;
    }

    public void setSkillIds(Set<Long> skillIds) {
        this.skillIds = skillIds;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public String getWorkingHoursType() {
        return workingHoursType;
    }

    public void setWorkingHoursType(String workingHoursType) {
        this.workingHoursType = workingHoursType;
    }

    public JobListing.Status getStatus() {
        return status;
    }

    public void setStatus(JobListing.Status status) {
        this.status = status;
    }

    public Integer getDaysBack() {
        return daysBack;
    }

    public void setDaysBack(Integer daysBack) {
        this.daysBack = daysBack;
    }

    public Integer getMinSalary() {
        return minSalary;
    }

    public void setMinSalary(Integer minSalary) {
        this.minSalary = minSalary;
    }

    public Integer getMaxSalary() {
        return maxSalary;
    }

    public void setMaxSalary(Integer maxSalary) {
        this.maxSalary = maxSalary;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public String getSortDirection() {
        return sortDirection;
    }

    public void setSortDirection(String sortDirection) {
        this.sortDirection = sortDirection;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        JobSearchRequest that = (JobSearchRequest) o;
        return Objects.equals(query, that.query) &&
                Objects.equals(location, that.location) &&
                Objects.equals(categoryId, that.categoryId) &&
                Objects.equals(skillIds, that.skillIds) &&
                Objects.equals(employmentType, that.employmentType) &&
                Objects.equals(workingHoursType, that.workingHoursType) &&
                status == that.status &&
                Objects.equals(daysBack, that.daysBack) &&
                Objects.equals(minSalary, that.minSalary) &&
                Objects.equals(maxSalary, that.maxSalary) &&
                Objects.equals(page, that.page) &&
                Objects.equals(size, that.size) &&
                Objects.equals(sortBy, that.sortBy) &&
                Objects.equals(sortDirection, that.sortDirection);
    }

    @Override
    public int hashCode() {
        return Objects.hash(query, location, categoryId, skillIds, employmentType, workingHoursType, 
                          status, daysBack, minSalary, maxSalary, page, size, sortBy, sortDirection);
    }

    @Override
    public String toString() {
        return "JobSearchRequest{" +
                "query='" + query + '\'' +
                ", location='" + location + '\'' +
                ", categoryId=" + categoryId +
                ", skillIds=" + skillIds +
                ", employmentType='" + employmentType + '\'' +
                ", workingHoursType='" + workingHoursType + '\'' +
                ", status=" + status +
                ", daysBack=" + daysBack +
                ", minSalary=" + minSalary +
                ", maxSalary=" + maxSalary +
                ", page=" + page +
                ", size=" + size +
                ", sortBy='" + sortBy + '\'' +
                ", sortDirection='" + sortDirection + '\'' +
                '}';
    }
}