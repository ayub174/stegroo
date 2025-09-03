package se.stegroo.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClient;
import se.stegroo.backend.dto.af.AfJobStreamResponse;
import se.stegroo.backend.model.JobCategory;
import se.stegroo.backend.model.Skill;
import se.stegroo.backend.repository.JobCategoryRepository;
import se.stegroo.backend.repository.SkillRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaxonomiServiceTest {

    @Mock
    private RestClient restClient;

    @Mock
    private JobCategoryRepository jobCategoryRepository;

    @Mock
    private SkillRepository skillRepository;

    @InjectMocks
    private TaxonomiService taxonomiService;

    private JobCategory testCategory;
    private Skill testSkill;
    private AfJobStreamResponse testResponse;

    @BeforeEach
    void setUp() {
        // Set up test data
        testCategory = new JobCategory();
        testCategory.setId(1L);
        testCategory.setName("Software Developer");
        testCategory.setDescription("Develops software applications");
        testCategory.setTaxonomyType(JobCategory.TaxonomyType.OCCUPATION);

        testSkill = new Skill();
        testSkill.setId(1L);
        testSkill.setName("Java");
        testSkill.setDescription("Java programming language");

        testResponse = new AfJobStreamResponse();
        testResponse.setAds(Arrays.asList(
            new AfJobStreamResponse.AfJobAd(),
            new AfJobStreamResponse.AfJobAd(),
            new AfJobStreamResponse.AfJobAd()
        ));

        // Set up configuration values
        ReflectionTestUtils.setField(taxonomiService, "baseUrl", "https://test-api.com");
        ReflectionTestUtils.setField(taxonomiService, "apiKey", "test-key");
    }

    @Test
    void syncAllTaxonomies_ShouldSyncAllTaxonomyTypes() {
        // Given
        when(jobCategoryRepository.save(any(JobCategory.class))).thenReturn(testCategory);
        when(skillRepository.save(any(Skill.class))).thenReturn(testSkill);

        // When
        taxonomiService.syncAllTaxonomies();

        // Then
        verify(jobCategoryRepository, atLeastOnce()).save(any(JobCategory.class));
        verify(skillRepository, atLeastOnce()).save(any(Skill.class));
    }

    @Test
    void syncTaxonomyType_ShouldSyncSpecificTaxonomyType() {
        // Given
        String taxonomyType = "occupation";
        JobCategory.TaxonomyType internalType = JobCategory.TaxonomyType.OCCUPATION;
        
        RestClient.RequestHeadersUriSpec uriSpec = mock(RestClient.RequestHeadersUriSpec.class);
        RestClient.RequestHeadersSpec headerSpec = mock(RestClient.RequestHeadersSpec.class);
        RestClient.ResponseSpec responseSpec = mock(RestClient.ResponseSpec.class);
        
        when(restClient.get()).thenReturn(uriSpec);
        when(uriSpec.uri(anyString())).thenReturn(headerSpec);
        when(headerSpec.header(anyString(), anyString())).thenReturn(headerSpec);
        when(headerSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(any(Class.class))).thenReturn(testResponse);
        
        when(jobCategoryRepository.save(any(JobCategory.class))).thenReturn(testCategory);

        // When
        taxonomiService.syncTaxonomyType(taxonomyType, internalType);

        // Then
        verify(restClient.get()).uri(contains("/taxonomy/" + taxonomyType));
        verify(jobCategoryRepository, atLeastOnce()).save(any(JobCategory.class));
    }

    @Test
    void syncTaxonomyType_ShouldHandleNullResponse() {
        // Given
        String taxonomyType = "occupation";
        JobCategory.TaxonomyType internalType = JobCategory.TaxonomyType.OCCUPATION;
        
        RestClient.RequestHeadersUriSpec uriSpec = mock(RestClient.RequestHeadersUriSpec.class);
        RestClient.RequestHeadersSpec headerSpec = mock(RestClient.RequestHeadersSpec.class);
        RestClient.ResponseSpec responseSpec = mock(RestClient.ResponseSpec.class);
        
        when(restClient.get()).thenReturn(uriSpec);
        when(uriSpec.uri(anyString())).thenReturn(headerSpec);
        when(headerSpec.header(anyString(), anyString())).thenReturn(headerSpec);
        when(headerSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(any(Class.class))).thenReturn(null);

        // When
        taxonomiService.syncTaxonomyType(taxonomyType, internalType);

        // Then
        verify(restClient.get()).uri(contains("/taxonomy/" + taxonomyType));
        verify(jobCategoryRepository, never()).save(any(JobCategory.class));
    }

    @Test
    void syncTaxonomyType_ShouldHandleEmptyAdsList() {
        // Given
        String taxonomyType = "occupation";
        JobCategory.TaxonomyType internalType = JobCategory.TaxonomyType.OCCUPATION;
        
        AfJobStreamResponse emptyResponse = new AfJobStreamResponse();
        emptyResponse.setAds(Collections.emptyList());
        
        RestClient.RequestHeadersUriSpec uriSpec = mock(RestClient.RequestHeadersUriSpec.class);
        RestClient.RequestHeadersSpec headerSpec = mock(RestClient.RequestHeadersSpec.class);
        RestClient.ResponseSpec responseSpec = mock(RestClient.ResponseSpec.class);
        
        when(restClient.get()).thenReturn(uriSpec);
        when(uriSpec.uri(anyString())).thenReturn(headerSpec);
        when(headerSpec.header(anyString(), anyString())).thenReturn(headerSpec);
        when(headerSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(any(Class.class))).thenReturn(emptyResponse);

        // When
        taxonomiService.syncTaxonomyType(taxonomyType, internalType);

        // Then
        verify(restClient.get()).uri(contains("/taxonomy/" + taxonomyType));
        verify(jobCategoryRepository, never()).save(any(JobCategory.class));
    }

    @Test
    void syncTaxonomyType_ShouldHandleApiException() {
        // Given
        String taxonomyType = "occupation";
        JobCategory.TaxonomyType internalType = JobCategory.TaxonomyType.OCCUPATION;
        
        RestClient.RequestHeadersUriSpec uriSpec = mock(RestClient.RequestHeadersUriSpec.class);
        RestClient.RequestHeadersSpec headerSpec = mock(RestClient.RequestHeadersSpec.class);
        RestClient.ResponseSpec responseSpec = mock(RestClient.ResponseSpec.class);
        
        when(restClient.get()).thenReturn(uriSpec);
        when(uriSpec.uri(anyString())).thenReturn(headerSpec);
        when(headerSpec.header(anyString(), anyString())).thenReturn(headerSpec);
        when(headerSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(any(Class.class)))
            .thenThrow(new RuntimeException("API error"));

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            taxonomiService.syncTaxonomyType(taxonomyType, internalType);
        });
    }




















}
