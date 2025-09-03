package se.stegroo.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import se.stegroo.backend.security.JwtTokenValidator;

/**
 * Konfigurationsklass för JWT-hantering.
 * Skapar JwtTokenValidator beans baserat på profil och konfiguration.
 */
@Configuration
public class JwtConfig {

    @Value("${supabase.jwt.secret}")
    private String jwtSecret;

    @Value("${supabase.jwt.issuer}")
    private String jwtIssuer;

    /**
     * Skapar en JwtTokenValidator när JWT är aktiverat.
     */
    @Bean
    @ConditionalOnProperty(name = "stegroo.security.jwt.enabled", havingValue = "true")
    public JwtTokenValidator jwtTokenValidator() {
        return new JwtTokenValidator(jwtSecret, jwtIssuer);
    }

    /**
     * Skapar en dummy JwtTokenValidator för tester när JWT inte är aktiverat.
     */
    @Bean
    @Profile("test")
    @ConditionalOnProperty(name = "stegroo.security.jwt.enabled", havingValue = "false")
    public JwtTokenValidator testJwtTokenValidator() {
        // Dummy validator för tester
        return new JwtTokenValidator("test-secret", "test-issuer");
    }
}
