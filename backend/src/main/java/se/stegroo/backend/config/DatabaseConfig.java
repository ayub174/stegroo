package se.stegroo.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

/**
 * Konfigurationsklass för databasanslutning.
 * Konfigurerar anslutning till Supabase PostgreSQL-databas eller H2-databas för lokal utveckling.
 */
@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

    /**
     * Skapar en DataSource baserat på konfigurationen i application.yml.
     * Används för att ansluta till Supabase-databasen i produktion eller H2-databasen för lokal utveckling.
     */
    @Bean
    @Primary
    @Profile("!test")
    public DataSource dataSource() {
        return DataSourceBuilder.create()
                .url(url)
                .username(username)
                .password(password)
                .driverClassName(driverClassName)
                .build();
    }
}
