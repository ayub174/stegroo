package se.stegroo.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Test för att verifiera att Spring-kontexten laddas korrekt.
 */
@SpringBootTest
@ActiveProfiles("test")
class StegrooBackendApplicationTests {

    @Test
    void contextLoads() {
        // Verifierar att Spring-kontexten laddas utan fel
    }
}
