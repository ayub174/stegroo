package se.stegroo.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integrationstester för JWT-säkerhet
 */
@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
class JwtSecurityIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Test
    void shouldAllowAccessToPublicEndpoints() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Publika endpoints ska vara tillgängliga utan autentisering
        mockMvc.perform(get("/api/jobs"))
                .andExpect(status().isOk());
                
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
    }

    @Test
    void shouldDenyAccessToAdminEndpointsWithoutAuth() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Admin endpoints ska kräva autentisering
        mockMvc.perform(get("/api/admin/categories"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldDenyAccessWithInvalidJwtToken() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Ogiltig JWT-token ska ge 401/403
        mockMvc.perform(get("/api/admin/categories")
                .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isForbidden());
    }
}
