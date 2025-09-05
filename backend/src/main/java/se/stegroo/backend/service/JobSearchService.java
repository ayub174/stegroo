package se.stegroo.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.stegroo.backend.dto.JobSearchRequest;
import se.stegroo.backend.dto.JobSearchResponse;
import se.stegroo.backend.model.JobListing;
import se.stegroo.backend.model.JobCategory;
import se.stegroo.backend.model.Skill;
import se.stegroo.backend.repository.JobListingRepository;
import se.stegroo.backend.repository.JobCategoryRepository;
import se.stegroo.backend.repository.SkillRepository;

import jakarta.persistence.criteria.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class JobSearchService {

    private static final Logger log = LoggerFactory.getLogger(JobSearchService.class);

    private final JobListingRepository jobListingRepository;
    private final JobCategoryRepository jobCategoryRepository;
    private final SkillRepository skillRepository;

    public JobSearchService(
            JobListingRepository jobListingRepository,
            JobCategoryRepository jobCategoryRepository,
            SkillRepository skillRepository) {
        this.jobListingRepository = jobListingRepository;
        this.jobCategoryRepository = jobCategoryRepository;
        this.skillRepository = skillRepository;
    }

    /**
     * Avancerad sökning med filtrering och sortering
     */
    public JobSearchResponse searchJobs(JobSearchRequest request) {
        log.info("Söker jobb med kriterier: {}", request);

        // Skapa specification för filtrering
        Specification<JobListing> spec = createSearchSpecification(request);

        // Skapa sortering
        Sort sort = createSort(request.getSortBy(), request.getSortDirection());

        // Skapa paginering
        Pageable pageable = PageRequest.of(
            request.getPage(), 
            request.getSize(), 
            sort
        );

        // Utför sökning
        Page<JobListing> jobPage = jobListingRepository.findAll(spec, pageable);

        // Konvertera till response
        JobSearchResponse response = JobSearchResponse.builder()
                .jobs(jobPage.getContent())
                .totalElements(jobPage.getTotalElements())
                .totalPages(jobPage.getTotalPages())
                .currentPage(jobPage.getNumber())
                .size(jobPage.getSize())
                .hasNext(jobPage.hasNext())
                .hasPrevious(jobPage.hasPrevious())
                .build();
        return response;
    }
    
    /**
     * Hämtar alla jobb från databasen
     */
    public List<JobListing> getAllJobs() {
        log.info("Hämtar alla jobb från databasen");
        return jobListingRepository.findAll();
    }

    /**
     * Skapar en specification för avancerad filtrering
     */
    private Specification<JobListing> createSearchSpecification(JobSearchRequest request) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new java.util.ArrayList<>();

            // Fulltext-sökning i title och description
            if (request.getQuery() != null && !request.getQuery().trim().isEmpty()) {
                String searchTerm = "%" + request.getQuery().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchTerm)
                ));
            }

            // Filtrering på plats
            if (request.getLocation() != null && !request.getLocation().trim().isEmpty()) {
                String locationTerm = "%" + request.getLocation().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("location")), locationTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("city")), locationTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("municipality")), locationTerm)
                ));
            }

            // Filtrering på kategori
            if (request.getCategoryId() != null) {
                Join<JobListing, JobCategory> categoryJoin = root.join("category", JoinType.INNER);
                predicates.add(criteriaBuilder.equal(categoryJoin.get("id"), request.getCategoryId()));
            }

            // Filtrering på kompetenser
            if (request.getSkillIds() != null && !request.getSkillIds().isEmpty()) {
                Join<JobListing, Skill> skillJoin = root.join("skills", JoinType.INNER);
                predicates.add(skillJoin.get("id").in(request.getSkillIds()));
            }

            // Filtrering på anställningstyp
            if (request.getEmploymentType() != null && !request.getEmploymentType().trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("employmentType"), request.getEmploymentType()));
            }

            // Filtrering på arbetstid
            if (request.getWorkingHoursType() != null && !request.getWorkingHoursType().trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("workingHoursType"), request.getWorkingHoursType()));
            }

            // Filtrering på status (endast aktiva jobb som standard)
            if (request.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), request.getStatus()));
            } else {
                predicates.add(criteriaBuilder.equal(root.get("status"), JobListing.Status.ACTIVE));
            }

            // Filtrering på datum (senaste X dagar)
            if (request.getDaysBack() != null && request.getDaysBack() > 0) {
                LocalDateTime cutoffDate = LocalDateTime.now().minusDays(request.getDaysBack());
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), cutoffDate));
            }

            // Filtrering på lön (om angivet)
            if (request.getMinSalary() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("salary"), request.getMinSalary()));
            }

            if (request.getMaxSalary() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("salary"), request.getMaxSalary()));
            }

            // Kombinera alla predicates med AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * Skapar sortering baserat på request
     */
    private Sort createSort(String sortBy, String sortDirection) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            sortBy = "createdAt"; // Standard sortering
        }

        Sort.Direction direction = Sort.Direction.DESC; // Standard riktning
        if (sortDirection != null && sortDirection.equalsIgnoreCase("asc")) {
            direction = Sort.Direction.ASC;
        }

        return Sort.by(direction, sortBy);
    }

    /**
     * Söker jobb baserat på kompetenser
     */
    public List<JobListing> findJobsBySkills(Set<String> skillNames) {
        log.info("Söker jobb baserat på kompetenser: {}", skillNames);
        
        if (skillNames == null || skillNames.isEmpty()) {
            return List.of();
        }
        
        List<Skill> skills = skillRepository.findByNameIn(skillNames);
        if (skills.isEmpty()) {
            return List.of();
        }

        Set<Long> skillIds = skills.stream()
                .map(Skill::getId)
                .collect(Collectors.toSet());

        return jobListingRepository.findBySkillsIdInAndStatus(skillIds, JobListing.Status.ACTIVE);
    }

    /**
     * Söker jobb inom en kategori och dess underkategorier
     */
    public List<JobListing> findJobsInCategoryHierarchy(Long categoryId) {
        log.info("Söker jobb i kategori-hierarki: {}", categoryId);
        
        if (categoryId == null) {
            return List.of();
        }
        
        JobCategory category = jobCategoryRepository.findById(categoryId)
                .orElse(null);
        
        if (category == null) {
            log.warn("Kategori hittades inte: {}", categoryId);
            return List.of();
        }

        // Hämta alla underkategorier rekursivt
        List<JobCategory> allCategories = new java.util.ArrayList<>();
        allCategories.add(category);
        allCategories.addAll(category.getAllDescendants());

        Set<Long> categoryIds = allCategories.stream()
                .map(JobCategory::getId)
                .collect(Collectors.toSet());

        return jobListingRepository.findByCategoryIdInAndStatus(categoryIds, JobListing.Status.ACTIVE);
    }

    /**
     * Söker liknande jobb baserat på en befintlig annons
     */
    public List<JobListing> findSimilarJobs(Long jobId, int limit) {
        log.info("Söker liknande jobb för jobb: {}", jobId);
        
        if (jobId == null) {
            return List.of();
        }
        
        JobListing sourceJob = jobListingRepository.findById(jobId)
                .orElse(null);
        
        if (sourceJob == null) {
            log.warn("Jobb hittades inte: {}", jobId);
            return List.of();
        }

        // Hitta jobb med samma kategori och liknande kompetenser
        List<JobListing> similarJobs = jobListingRepository.findSimilarJobs(
                sourceJob.getCategory().getId(),
                sourceJob.getSkills().stream().map(Skill::getId).collect(Collectors.toSet()),
                sourceJob.getId(),
                limit
        );

        return similarJobs;
    }

    /**
     * Hämtar jobb-statistik för dashboard
     */
    public JobSearchResponse.JobStats getJobStats() {
        long totalJobs = jobListingRepository.count();
        long activeJobs = jobListingRepository.countByStatus(JobListing.Status.ACTIVE);
        long expiredJobs = jobListingRepository.countByStatus(JobListing.Status.EXPIRED);
        long removedJobs = jobListingRepository.countByStatus(JobListing.Status.REMOVED);

        return JobSearchResponse.JobStats.builder()
                .totalJobs(totalJobs)
                .activeJobs(activeJobs)
                .expiredJobs(expiredJobs)
                .removedJobs(removedJobs)
                .build();
    }

    /**
     * Hämtar populära kategorier baserat på antal jobb
     */
    public List<JobCategory> getPopularCategories(int limit) {
        return jobCategoryRepository.findPopularCategories(limit);
    }

    /**
     * Hämtar populära kompetenser baserat på antal jobb
     */
    public List<Skill> getPopularSkills(int limit) {
        return skillRepository.findPopularSkills(limit);
    }
}
