package se.stegroo.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.stegroo.backend.controller.SkillController.SkillDTO;
import se.stegroo.backend.model.Skill;
import se.stegroo.backend.repository.SkillRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SkillControllerTest {

    @Mock
    private SkillRepository skillRepository;

    @InjectMocks
    private SkillController skillController;

    private Skill skill1;
    private Skill skill2;

    @BeforeEach
    void setUp() {
        // Skapa test-data
        skill1 = new Skill();
        skill1.setId(1L);
        skill1.setName("Java");
        skill1.setDescription("Programmeringsspråk");
        
        skill2 = new Skill();
        skill2.setId(2L);
        skill2.setName("Spring");
        skill2.setDescription("Java-ramverk");
    }

    @Test
    void getAllSkills_ShouldReturnAllSkills() {
        // Given
        when(skillRepository.findAll()).thenReturn(Arrays.asList(skill1, skill2));

        // When
        ResponseEntity<List<SkillDTO>> response = skillController.getAllSkills();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        
        SkillDTO dto1 = response.getBody().get(0);
        assertEquals(1L, dto1.getId());
        assertEquals("Java", dto1.getName());
        assertEquals("Programmeringsspråk", dto1.getDescription());
        
        SkillDTO dto2 = response.getBody().get(1);
        assertEquals(2L, dto2.getId());
        assertEquals("Spring", dto2.getName());
        assertEquals("Java-ramverk", dto2.getDescription());
        
        verify(skillRepository).findAll();
    }

    @Test
    void searchSkills_ShouldReturnMatchingSkills() {
        // Given
        when(skillRepository.findByNameContainingIgnoreCase("java")).thenReturn(Arrays.asList(skill1));

        // When
        ResponseEntity<List<SkillDTO>> response = skillController.searchSkills("java");

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Java", response.getBody().get(0).getName());
        
        verify(skillRepository).findByNameContainingIgnoreCase("java");
    }

    @Test
    void getPopularSkills_ShouldReturnPopularSkills() {
        // Given
        when(skillRepository.findMostPopularSkills(any(Pageable.class))).thenReturn(Arrays.asList(skill1, skill2));

        // When
        ResponseEntity<List<SkillDTO>> response = skillController.getPopularSkills(10);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        
        verify(skillRepository).findMostPopularSkills(any(Pageable.class));
    }

    @Test
    void getSkillById_ShouldReturnSkill_WhenSkillExists() {
        // Given
        when(skillRepository.findById(1L)).thenReturn(Optional.of(skill1));

        // When
        ResponseEntity<SkillDTO> response = skillController.getSkillById(1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("Java", response.getBody().getName());
        
        verify(skillRepository).findById(1L);
    }

    @Test
    void getSkillById_ShouldReturnNotFound_WhenSkillDoesNotExist() {
        // Given
        when(skillRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        ResponseEntity<SkillDTO> response = skillController.getSkillById(999L);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        
        verify(skillRepository).findById(999L);
    }
}
