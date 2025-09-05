package se.stegroo.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Validerar JWT-tokens från Supabase Auth.
 */
public class JwtTokenValidator {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenValidator.class);
    
    private final Key key;
    private final String issuer;

    /**
     * Skapar en ny JwtTokenValidator.
     *
     * @param secret JWT-hemlighet från Supabase
     * @param issuer JWT-utfärdare (issuer) från Supabase
     */
    public JwtTokenValidator(String secret, String issuer) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.issuer = issuer;
    }

    /**
     * Validerar en JWT-token och returnerar en Authentication-objekt om token är giltig.
     *
     * @param token JWT-token att validera
     * @return Authentication-objekt om token är giltig, null annars
     */
    public Authentication validateToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Verifiera utfärdare
            if (!claims.getIssuer().equals(issuer)) {
                log.warn("Invalid issuer: {}", claims.getIssuer());
                return null;
            }

            // Hämta användar-ID från token
            String userId = claims.getSubject();
            
            // Hämta roller från token
            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
            
            // Lägg till standardroll
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            
            // Lägg till eventuella ytterligare roller från token
            if (claims.get("app_metadata") instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> appMetadata = (Map<String, Object>) claims.get("app_metadata");
                
                if (appMetadata.get("roles") instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<String> roles = (List<String>) appMetadata.get("roles");
                    
                    roles.forEach(role -> authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())));
                }
            }
            
            // Skapa Authentication-objekt
            return new UsernamePasswordAuthenticationToken(userId, null, authorities);
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return null;
        }
    }
}
