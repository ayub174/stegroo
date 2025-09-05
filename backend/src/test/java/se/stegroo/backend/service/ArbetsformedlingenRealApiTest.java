package se.stegroo.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;
import se.stegroo.backend.dto.af.AfJobStreamResponse;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test för att verifiera riktiga API-anrop till Arbetsförmedlingen utan API-nyckel
 */
public class ArbetsformedlingenRealApiTest {

    @Test
    public void testDirectApiCallWithoutApiKey() {
        RestClient restClient = RestClient.create();
        String baseUrl = "https://jobstream.api.jobtechdev.se";
        
        // Testa med datum från igår
        String date = LocalDate.now().minusDays(1).toString();
        String url = baseUrl + "/stream?date=" + date;
        
        System.out.println("Testar API-anrop till: " + url);
        
        try {
            AfJobStreamResponse response = restClient.get()
                    .uri(url)
                    .header("Accept", "application/json")
                    .retrieve()
                    .body(AfJobStreamResponse.class);
            
            assertNotNull(response, "API-svar ska inte vara null");
            
            if (response.getAds() != null && !response.getAds().isEmpty()) {
                System.out.println("✅ API-anrop lyckades!");
                System.out.println("Antal jobb: " + response.getAds().size());
                System.out.println("Första jobbet: " + response.getAds().get(0).getHeadline());
                
                if (response.getAds().get(0).getEmployer() != null) {
                    System.out.println("Företag: " + response.getAds().get(0).getEmployer().getName());
                }
            } else {
                System.out.println("✅ API-anrop lyckades men inga jobb hittades för datum: " + date);
            }
            
            // Testa med ett äldre datum för att få fler resultat
            if (response.getAds() == null || response.getAds().isEmpty()) {
                String olderDate = LocalDate.now().minusDays(7).toString();
                String olderUrl = baseUrl + "/stream?date=" + olderDate;
                
                System.out.println("Testar med äldre datum: " + olderUrl);
                
                AfJobStreamResponse olderResponse = restClient.get()
                        .uri(olderUrl)
                        .header("Accept", "application/json")
                        .retrieve()
                        .body(AfJobStreamResponse.class);
                
                if (olderResponse != null && olderResponse.getAds() != null && !olderResponse.getAds().isEmpty()) {
                    System.out.println("✅ Äldre datum gav " + olderResponse.getAds().size() + " jobb");
                }
            }
            
        } catch (Exception e) {
            fail("API-anrop misslyckades: " + e.getMessage());
        }
    }
    
    @Test
    public void testApiWithoutDateParameter() {
        RestClient restClient = RestClient.create();
        String baseUrl = "https://jobstream.api.jobtechdev.se";
        String url = baseUrl + "/stream";
        
        System.out.println("Testar API utan datum-parameter: " + url);
        
        try {
            String response = restClient.get()
                    .uri(url)
                    .header("Accept", "application/json")
                    .retrieve()
                    .body(String.class);
            
            System.out.println("Svar: " + response);
            assertTrue(response.contains("Missing required parameter"), 
                      "API ska kräva datum-parameter");
            
        } catch (Exception e) {
            System.out.println("Förväntat fel: " + e.getMessage());
        }
    }
}
