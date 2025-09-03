package se.stegroo.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Huvudapplikationsklass för Stegroo Backend.
 * Hanterar jobbsynkronisering från Arbetsförmedlingens API och erbjuder tjänster
 * för jobbsökning och matchning.
 */
@SpringBootApplication
@ComponentScan(basePackages = {
    "se.stegroo.backend",
    "se.stegroo.backend.config",
    "se.stegroo.backend.controller",
    "se.stegroo.backend.service",
    "se.stegroo.backend.repository",
    "se.stegroo.backend.security",
    "se.stegroo.backend.aspect"
})
@EnableScheduling
@EnableJpaAuditing
public class StegrooBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(StegrooBackendApplication.class, args);
    }
}
