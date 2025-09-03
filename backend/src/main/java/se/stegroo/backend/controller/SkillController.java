package se.stegroo.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.stegroo.backend.model.Skill;
import se.stegroo.backend.repository.SkillRepository;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST-controller för kompetenser.
 */
@RestController
@RequestMapping("/api/skills")
@Tag(name = "Skills", description = "API för kompetenser")
public class SkillController {

    private final SkillRepository skillRepository;
    
    public SkillController(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    /**
     * Hämtar alla kompetenser.
     *
     * @return Lista med alla kompetenser
     */
    @GetMapping
    @Operation(summary = "Hämta alla kompetenser", description = "Hämtar en lista med alla tillgängliga kompetenser")
    public ResponseEntity<List<SkillDTO>> getAllSkills() {
        List<SkillDTO> skills = skillRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(skills);
    }

    /**
     * Söker efter kompetenser baserat på namn.
     *
     * @param name Namn att söka efter
     * @return Lista med matchande kompetenser
     */
    @GetMapping("/search")
    @Operation(summary = "Sök efter kompetenser", description = "Söker efter kompetenser baserat på namn")
    public ResponseEntity<List<SkillDTO>> searchSkills(
            @Parameter(description = "Namn att söka efter") @RequestParam String name) {
        List<SkillDTO> skills = skillRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(skills);
    }

    /**
     * Hämtar de mest populära kompetenserna.
     *
     * @param limit Antal kompetenser att hämta
     * @return Lista med de mest populära kompetenserna
     */
    @GetMapping("/popular")
    @Operation(summary = "Hämta populära kompetenser", description = "Hämtar de mest efterfrågade kompetenserna")
    public ResponseEntity<List<SkillDTO>> getPopularSkills(
            @Parameter(description = "Antal kompetenser att hämta") @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<SkillDTO> skills = skillRepository.findMostPopularSkills(pageable).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(skills);
    }

    /**
     * Hämtar en kompetens baserat på ID.
     *
     * @param id Kompetens-ID
     * @return Kompetens-DTO
     */
    @GetMapping("/{id}")
    @Operation(summary = "Hämta kompetens", description = "Hämtar en specifik kompetens baserat på ID")
    public ResponseEntity<SkillDTO> getSkillById(
            @Parameter(description = "Kompetens-ID") @PathVariable Long id) {
        return skillRepository.findById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DTO för kompetens.
     */
    public static class SkillDTO {
        private Long id;
        private String name;
        private String description;
        
        public SkillDTO() {
        }
        
        public SkillDTO(Long id, String name, String description) {
            this.id = id;
            this.name = name;
            this.description = description;
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
        
        public static SkillDTOBuilder builder() {
            return new SkillDTOBuilder();
        }
        
        public static class SkillDTOBuilder {
            private Long id;
            private String name;
            private String description;
            
            public SkillDTOBuilder id(Long id) {
                this.id = id;
                return this;
            }
            
            public SkillDTOBuilder name(String name) {
                this.name = name;
                return this;
            }
            
            public SkillDTOBuilder description(String description) {
                this.description = description;
                return this;
            }
            
            public SkillDTO build() {
                return new SkillDTO(id, name, description);
            }
        }
    }

    /**
     * Konverterar en kompetens till DTO.
     *
     * @param skill Kompetens
     * @return Kompetens-DTO
     */
    private SkillDTO convertToDTO(Skill skill) {
        return SkillDTO.builder()
                .id(skill.getId())
                .name(skill.getName())
                .description(skill.getDescription())
                .build();
    }
}