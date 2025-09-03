package se.stegroo.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.stegroo.backend.model.JobCategory;
import se.stegroo.backend.repository.JobCategoryRepository;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST-controller för jobbkategorier.
 */
@RestController
@RequestMapping("/api/categories")
@Tag(name = "Categories", description = "API för jobbkategorier")
public class CategoryController {

    private final JobCategoryRepository jobCategoryRepository;
    
    public CategoryController(JobCategoryRepository jobCategoryRepository) {
        this.jobCategoryRepository = jobCategoryRepository;
    }

    /**
     * Hämtar alla kategorier.
     *
     * @return Lista med alla kategorier
     */
    @GetMapping
    @Operation(summary = "Hämta alla kategorier", description = "Hämtar en lista med alla tillgängliga jobbkategorier")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> categories = jobCategoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    /**
     * Hämtar alla toppnivåkategorier.
     *
     * @return Lista med toppnivåkategorier
     */
    @GetMapping("/top-level")
    @Operation(summary = "Hämta toppnivåkategorier", description = "Hämtar en lista med alla kategorier på toppnivå")
    public ResponseEntity<List<CategoryDTO>> getTopLevelCategories() {
        List<CategoryDTO> categories = jobCategoryRepository.findByParentIsNull().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    /**
     * Hämtar underkategorier för en given förälderkategori.
     *
     * @param parentId Förälderkategori-ID
     * @return Lista med underkategorier
     */
    @GetMapping("/subcategories/{parentId}")
    @Operation(summary = "Hämta underkategorier", description = "Hämtar en lista med underkategorier för en given förälderkategori")
    public ResponseEntity<List<CategoryDTO>> getSubcategories(
            @Parameter(description = "Förälderkategori-ID") @PathVariable Long parentId) {
        List<CategoryDTO> categories = jobCategoryRepository.findByParentId(parentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    /**
     * Hämtar en kategori baserat på ID.
     *
     * @param id Kategori-ID
     * @return Kategori-DTO
     */
    @GetMapping("/{id}")
    @Operation(summary = "Hämta kategori", description = "Hämtar en specifik kategori baserat på ID")
    public ResponseEntity<CategoryDTO> getCategoryById(
            @Parameter(description = "Kategori-ID") @PathVariable Long id) {
        return jobCategoryRepository.findById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DTO för kategori.
     */
    public static class CategoryDTO {
        private Long id;
        private String name;
        private String description;
        private Long parentId;
        private String parentName;
        private boolean hasChildren;
        
        public CategoryDTO() {
        }
        
        public CategoryDTO(Long id, String name, String description, Long parentId, 
                          String parentName, boolean hasChildren) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.parentId = parentId;
            this.parentName = parentName;
            this.hasChildren = hasChildren;
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
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
        
        public Long getParentId() {
            return parentId;
        }
        
        public void setParentId(Long parentId) {
            this.parentId = parentId;
        }
        
        public String getParentName() {
            return parentName;
        }
        
        public void setParentName(String parentName) {
            this.parentName = parentName;
        }
        
        public boolean isHasChildren() {
            return hasChildren;
        }
        
        public void setHasChildren(boolean hasChildren) {
            this.hasChildren = hasChildren;
        }
        
        public static CategoryDTOBuilder builder() {
            return new CategoryDTOBuilder();
        }
        
        public static class CategoryDTOBuilder {
            private Long id;
            private String name;
            private String description;
            private Long parentId;
            private String parentName;
            private boolean hasChildren;
            
            public CategoryDTOBuilder id(Long id) {
                this.id = id;
                return this;
            }
            
            public CategoryDTOBuilder name(String name) {
                this.name = name;
                return this;
            }
            
            public CategoryDTOBuilder description(String description) {
                this.description = description;
                return this;
            }
            
            public CategoryDTOBuilder parentId(Long parentId) {
                this.parentId = parentId;
                return this;
            }
            
            public CategoryDTOBuilder parentName(String parentName) {
                this.parentName = parentName;
                return this;
            }
            
            public CategoryDTOBuilder hasChildren(boolean hasChildren) {
                this.hasChildren = hasChildren;
                return this;
            }
            
            public CategoryDTO build() {
                return new CategoryDTO(id, name, description, parentId, parentName, hasChildren);
            }
        }
    }

    /**
     * Konverterar en kategori till DTO.
     *
     * @param category Kategori
     * @return Kategori-DTO
     */
    private CategoryDTO convertToDTO(JobCategory category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .parentName(category.getParent() != null ? category.getParent().getName() : null)
                .hasChildren(!category.getChildren().isEmpty())
                .build();
    }
}