package se.stegroo.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import se.stegroo.backend.dto.af.AfJobStreamResponse;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test för att verifiera att AfJobStreamResponse kan deserialiseras korrekt
 */
class JobStreamApiTest {

    private ObjectMapper objectMapper;
    
    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void testDeserializeApiResponse() throws Exception {
        // Testa med en enkel JSON som representerar API-svaret
        String jsonResponse = """
            {
                "ads": [
                    {
                        "id": "29948030",
                        "headline": "Hästintresserad personlig assistent sökes till en aktiv och glad tjej!",
                        "employer": {
                            "name": "Frösunda Personlig Assistans AB"
                        },
                        "workplace_address": {
                            "municipality": "Stockholm"
                        },
                        "webpage_url": {
                            "url": "https://arbetsformedlingen.se/platsbanken/annonser/29948030"
                        }
                    }
                ],
                "next": "https://jobstream.api.jobtechdev.se/stream?page=2",
                "expired": null,
                "removed": null
            }
            """;

        // Försök deserialisera
        AfJobStreamResponse response = objectMapper.readValue(jsonResponse, AfJobStreamResponse.class);

        // Verifiera att deserialiseringen lyckades
        assertNotNull(response);
        assertNotNull(response.getAds());
        assertEquals(1, response.getAds().size());
        assertEquals("https://jobstream.api.jobtechdev.se/stream?page=2", response.getNext());

        var job = response.getAds().get(0);
        assertEquals("29948030", job.getId());
        assertEquals("Hästintresserad personlig assistent sökes till en aktiv och glad tjej!", job.getHeadline());
        assertEquals("https://arbetsformedlingen.se/platsbanken/annonser/29948030", job.getWebpageUrl().getUrl());
        assertEquals("Frösunda Personlig Assistans AB", job.getEmployer().getName());
        assertEquals("Stockholm", job.getWorkplaceAddress().getMunicipality());
    }

    @Test
    void testDeserializeRealApiResponse() throws Exception {
        // Testa med ett mer komplett API-svar
        String jsonResponse = """
            {
                "ads": [
                    {
                        "id": "29948026",
                        "external_id": null,
                        "webpage_url": {
                            "url": "https://arbetsformedlingen.se/platsbanken/annonser/29948026"
                        },
                        "logo_url": "https://arbetsformedlingen.se/rest/agas/api/v1/arbetsplatser/25052045/logotyper/logo.png",
                        "headline": "Erfaren Plattsättare sökes!",
                        "application": {
                            "url": "https://example.com/apply",
                            "email": "jobs@example.com",
                            "contacts": [
                                {
                                    "name": "HR Department",
                                    "email": "hr@example.com"
                                }
                            ]
                        },
                        "employer": {
                            "name": "Göta Golv & Kakel AB",
                            "organization_number": "123456-7890"
                        },
                        "description": {
                            "text": "Om jobbet\\nVi söker en erfaren Plattsättare till vårt team!"
                        },
                        "workplace_address": {
                            "municipality": "Göteborg",
                            "region": "Västra Götaland",
                            "country": "Sverige",
                            "coordinates": [11.97, 57.71]
                        },
                        "publication_date": "2025-08-01T10:00:00",
                        "application_deadline": "2025-09-01T23:59:59",
                        "employment_type": {
                            "concept_id": "PFZr_Syz_eTu",
                            "label": "Heltid"
                        },
                        "occupation": [
                            {
                                "concept_id": "3hFT_7WS_R8E",
                                "label": "Plattsättare"
                            }
                        ]
                    }
                ],
                "next": "https://jobstream.api.jobtechdev.se/stream?page=2",
                "expired": null,
                "removed": null
            }
            """;

        // Försök deserialisera
        AfJobStreamResponse response = objectMapper.readValue(jsonResponse, AfJobStreamResponse.class);

        // Verifiera att deserialiseringen lyckades
        assertNotNull(response);
        assertNotNull(response.getAds());
        assertEquals(1, response.getAds().size());
        assertEquals("https://jobstream.api.jobtechdev.se/stream?page=2", response.getNext());

        var job = response.getAds().get(0);
        assertEquals("29948026", job.getId());
        assertEquals("Erfaren Plattsättare sökes!", job.getHeadline());
        assertEquals("https://arbetsformedlingen.se/platsbanken/annonser/29948026", job.getWebpageUrl().getUrl());
        assertEquals("Göta Golv & Kakel AB", job.getEmployer().getName());
        assertEquals("Göteborg", job.getWorkplaceAddress().getMunicipality());
        assertEquals("Om jobbet\nVi söker en erfaren Plattsättare till vårt team!", job.getDescription().getText());
        assertEquals("Heltid", job.getEmploymentType().getLabel());
        assertEquals(1, job.getOccupation().size());
        assertEquals("Plattsättare", job.getOccupation().get(0).getLabel());
    }
}
