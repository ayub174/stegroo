package se.stegroo.backend.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JobCategoryTest {

    @Test
    void testJobCategoryCreation() {
        // Skapa en kategori
        JobCategory category = new JobCategory();
        category.setId(1L);
        category.setName("IT");
        category.setDescription("Informationsteknologi");
        category.setExternalId("af-taxonomy-id-123");
        
        // Verifiera att fälten är korrekt satta
        assertEquals(1L, category.getId());
        assertEquals("IT", category.getName());
        assertEquals("Informationsteknologi", category.getDescription());
        assertEquals("af-taxonomy-id-123", category.getExternalId());
    }
    
    @Test
    void testJobCategoryEquality() {
        // Skapa två kategorier med samma ID
        JobCategory category1 = new JobCategory();
        category1.setId(1L);
        category1.setName("IT");
        
        JobCategory category2 = new JobCategory();
        category2.setId(1L);
        category2.setName("Informationsteknologi"); // Annat namn, men samma ID
        
        // Verifiera att equals och hashCode baseras på ID
        assertEquals(category1, category2);
        assertEquals(category1.hashCode(), category2.hashCode());
    }
    
    @Test
    void testJobCategoryInequality() {
        // Skapa två kategorier med olika ID
        JobCategory category1 = new JobCategory();
        category1.setId(1L);
        category1.setName("IT");
        
        JobCategory category2 = new JobCategory();
        category2.setId(2L);
        category2.setName("IT"); // Samma namn, men olika ID
        
        // Verifiera att equals och hashCode baseras på ID
        assertNotEquals(category1, category2);
        assertNotEquals(category1.hashCode(), category2.hashCode());
    }
    
    @Test
    void testJobCategoryWithParent() {
        // Skapa en förälderkategori
        JobCategory parentCategory = new JobCategory();
        parentCategory.setId(1L);
        parentCategory.setName("IT");
        
        // Skapa en underkategori
        JobCategory childCategory = new JobCategory();
        childCategory.setId(2L);
        childCategory.setName("Programmering");
        childCategory.setParent(parentCategory);
        
        // Verifiera relationen
        assertEquals(parentCategory, childCategory.getParent());
        assertNull(parentCategory.getParent());
    }
}
