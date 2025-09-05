package se.stegroo.backend.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

/**
 * Konfiguration för REST-klienter med anpassade timeouts och retry-strategier.
 */
@Configuration
public class RestClientConfig {
    
    private final RetryConfig retryConfig;
    
    public RestClientConfig(RetryConfig retryConfig) {
        this.retryConfig = retryConfig;
    }
    
    /**
     * Skapar en RestTemplate med anpassade timeouts
     */
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                .setConnectTimeout(Duration.ofMillis(retryConfig.getApiRetry().getConnectionTimeoutMs()))
                .setReadTimeout(Duration.ofMillis(retryConfig.getApiRetry().getReadTimeoutMs()))
                .build();
    }
    
    /**
     * Skapar en RestClient med anpassade timeouts
     */
    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .requestFactory(requestFactory())
                .build();
    }
    
    /**
     * Skapar en anpassad RequestFactory med timeouts
     */
    private org.springframework.http.client.SimpleClientHttpRequestFactory requestFactory() {
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = 
            new org.springframework.http.client.SimpleClientHttpRequestFactory();
        
        factory.setConnectTimeout((int) retryConfig.getApiRetry().getConnectionTimeoutMs());
        factory.setReadTimeout((int) retryConfig.getApiRetry().getReadTimeoutMs());
        
        return factory;
    }
}
