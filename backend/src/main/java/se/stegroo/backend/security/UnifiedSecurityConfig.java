package se.stegroo.backend.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.UUID;

/**
 * Enhetlig säkerhetskonfiguration som hanterar alla säkerhetsprofiler
 * och eliminerar konflikter mellan olika säkerhetskonfigurationer.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class UnifiedSecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(UnifiedSecurityConfig.class);

    @Value("${stegroo.security.cors.allowed-origins:http://localhost:3000,http://localhost:5173}")
    private String allowedOrigins;

    @Value("${stegroo.security.cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS}")
    private String allowedMethods;

    @Value("${stegroo.security.cors.allowed-headers:*}")
    private String allowedHeaders;

    @Value("${stegroo.security.cors.max-age:3600}")
    private long maxAge;

    /**
     * Dev-profil säkerhetskonfiguration med JWT när aktiverat
     */
    @Bean("devSecurityFilterChain")
    @Profile("dev")
    @ConditionalOnProperty(name = "stegroo.security.jwt.enabled", havingValue = "true")
    @Primary
    public SecurityFilterChain devSecurityFilterChainWithJwt(HttpSecurity http, JwtTokenValidator jwtTokenValidator) throws Exception {
        log.info("Konfigurerar dev-säkerhet med JWT-validering");
        
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable)) // För H2-konsolen
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Publika endpoints
                .requestMatchers(
                    "/actuator/health",
                    "/actuator/info",
                    "/api/public/**",
                    "/api/jobs/sync",
                    "/error",
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/h2-console/**",
                    "/api/jobs/**",
                    "/api/categories/**",
                    "/api/skills/**"
                ).permitAll()
                
                // Admin endpoints kräver ADMIN-roll
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // API endpoints kräver autentisering
                .requestMatchers("/api/**").authenticated()
                
                // Alla andra requests kräver autentisering
                .anyRequest().authenticated()
            )
            .addFilterBefore(new JwtAuthenticationFilter(jwtTokenValidator), UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(securityHeadersFilter(), UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    /**
     * Dev-profil säkerhetskonfiguration utan JWT - tillåter alla anrop
     */
    @Bean("devSecurityFilterChainNoJwt")
    @Profile("dev")
    @ConditionalOnProperty(name = "stegroo.security.jwt.enabled", havingValue = "false", matchIfMissing = true)
    public SecurityFilterChain devSecurityFilterChainNoJwt(HttpSecurity http) throws Exception {
        log.info("Konfigurerar dev-säkerhet - alla endpoints tillåtna utan autentisering");
        
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .headers(headers -> headers.frameOptions().disable()) // För H2-konsolen
            .authorizeHttpRequests(authz -> authz
                .anyRequest().permitAll()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .build();
    }

    /**
     * Produktionssäkerhetskonfiguration med JWT-validering
     */
    @Bean("productionSecurityFilterChain")
    @Profile("!dev")
    @ConditionalOnProperty(name = "stegroo.security.jwt.enabled", havingValue = "true", matchIfMissing = true)
    public SecurityFilterChain productionSecurityFilterChain(HttpSecurity http, JwtTokenValidator jwtTokenValidator) throws Exception {
        log.info("Konfigurerar produktion-säkerhet med JWT-validering");
        
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Publika endpoints
                .requestMatchers(
                    "/actuator/health",
                    "/actuator/info",
                    "/api/public/**",
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/api/jobs/**",
                    "/api/categories/**",
                    "/api/skills/**"
                ).permitAll()
                
                // Admin endpoints kräver ADMIN-roll
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // API endpoints kräver autentisering
                .requestMatchers("/api/**").authenticated()
                
                // Alla andra requests kräver autentisering
                .anyRequest().authenticated()
            )
            .addFilterBefore(new JwtAuthenticationFilter(jwtTokenValidator), UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(securityHeadersFilter(), UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    /**
     * Fallback-säkerhetskonfiguration för när JWT inte är aktiverat
     */
    @Bean("fallbackSecurityFilterChain")
    @Profile("!dev")
    @ConditionalOnProperty(name = "stegroo.security.jwt.enabled", havingValue = "false")
    public SecurityFilterChain fallbackSecurityFilterChain(HttpSecurity http) throws Exception {
        log.info("Konfigurerar fallback-säkerhet utan JWT");
        
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(
                    "/actuator/health",
                    "/actuator/info",
                    "/api/public/**",
                    "/swagger-ui/**",
                    "/v3/api-docs/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .addFilterAfter(securityHeadersFilter(), UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    /**
     * CORS-konfiguration som används av alla säkerhetsprofiler
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        String[] origins = allowedOrigins.split(",");
        String[] methods = allowedMethods.split(",");
        String[] headers = allowedHeaders.split(",");
        
        configuration.setAllowedOrigins(Arrays.asList(origins));
        configuration.setAllowedMethods(Arrays.asList(methods));
        configuration.setAllowedHeaders(Arrays.asList(headers));
        configuration.setMaxAge(maxAge);
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    /**
     * Säkerhetsheaders filter
     */
    private OncePerRequestFilter securityHeadersFilter() {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request, 
                                        HttpServletResponse response, 
                                        FilterChain filterChain) throws ServletException, IOException {
                
                // Lägg till säkerhetsheaders
                response.setHeader("X-Content-Type-Options", "nosniff");
                response.setHeader("X-Frame-Options", "DENY");
                response.setHeader("X-XSS-Protection", "1; mode=block");
                response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
                response.setHeader("Permissions-Policy", "geolocation=(), microphone=()");
                
                // Lägg till request ID för spårning
                String requestId = request.getHeader("X-Request-ID");
                if (requestId == null) {
                    requestId = UUID.randomUUID().toString();
                }
                response.setHeader("X-Request-ID", requestId);
                
                filterChain.doFilter(request, response);
            }
        };
    }
}
