package se.stegroo.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.stegroo.backend.controller.CategoryController.CategoryDTO;
import se.stegroo.backend.model.JobCategory;
import se.stegroo.backend.repository.JobCategoryRepository;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryControllerTest {

    @Mock
    private JobCategoryRepository jobCategoryRepository;

    @InjectMocks
    private CategoryController categoryController;

    private JobCategory parentCategory;
    private JobCategory childCategory;

    @BeforeEach
    void setUp() {
        // Skapa test-data
        parentCategory = new JobCategory();
        parentCategory.setId(1L);
        parentCategory.setName("IT");
        parentCategory.setDescription("Informationsteknologi");
        parentCategory.setChildren(new HashSet<>());
        
        childCategory = new JobCategory();
        childCategory.setId(2L);
        childCategory.setName("Programmering");
        childCategory.setDescription("Utveckling av mjukvara");
        childCategory.setParent(parentCategory);
        
        parentCategory.getChildren().add(childCategory);
    }

    @Test
    void getAllCategories_ShouldReturnAllCategories() {
        // Given
        when(jobCategoryRepository.findAll()).thenReturn(Arrays.asList(parentCategory, childCategory));

        // When
        ResponseEntity<List<CategoryDTO>> response = categoryController.getAllCategories();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        
        CategoryDTO parentDTO = response.getBody().get(0);
        assertEquals(1L, parentDTO.getId());
        assertEquals("IT", parentDTO.getName());
        assertEquals("Informationsteknologi", parentDTO.getDescription());
        assertNull(parentDTO.getParentId());
        assertTrue(parentDTO.isHasChildren());
        
        CategoryDTO childDTO = response.getBody().get(1);
        assertEquals(2L, childDTO.getId());
        assertEquals("Programmering", childDTO.getName());
        assertEquals("Utveckling av mjukvara", childDTO.getDescription());
        assertEquals(1L, childDTO.getParentId());
        assertEquals("IT", childDTO.getParentName());
        assertFalse(childDTO.isHasChildren());
        
        verify(jobCategoryRepository).findAll();
    }

    @Test
    void getTopLevelCategories_ShouldReturnTopLevelCategories() {
        // Given
        when(jobCategoryRepository.findByParentIsNull()).thenReturn(Collections.singletonList(parentCategory));

        // When
        ResponseEntity<List<CategoryDTO>> response = categoryController.getTopLevelCategories();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        
        CategoryDTO dto = response.getBody().get(0);
        assertEquals(1L, dto.getId());
        assertEquals("IT", dto.getName());
        assertTrue(dto.isHasChildren());
        
        verify(jobCategoryRepository).findByParentIsNull();
    }

    @Test
    void getSubcategories_ShouldReturnSubcategories() {
        // Given
        when(jobCategoryRepository.findByParentId(1L)).thenReturn(Collections.singletonList(childCategory));

        // When
        ResponseEntity<List<CategoryDTO>> response = categoryController.getSubcategories(1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        
        CategoryDTO dto = response.getBody().get(0);
        assertEquals(2L, dto.getId());
        assertEquals("Programmering", dto.getName());
        assertEquals(1L, dto.getParentId());
        
        verify(jobCategoryRepository).findByParentId(1L);
    }

    @Test
    void getCategoryById_ShouldReturnCategory_WhenCategoryExists() {
        // Given
        when(jobCategoryRepository.findById(1L)).thenReturn(Optional.of(parentCategory));

        // When
        ResponseEntity<CategoryDTO> response = categoryController.getCategoryById(1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("IT", response.getBody().getName());
        
        verify(jobCategoryRepository).findById(1L);
    }

    @Test
    void getCategoryById_ShouldReturnNotFound_WhenCategoryDoesNotExist() {
        // Given
        when(jobCategoryRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        ResponseEntity<CategoryDTO> response = categoryController.getCategoryById(999L);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        
        verify(jobCategoryRepository).findById(999L);
    }
}
