package se.stegroo.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Test controller för att verifiera att Spring Boot routing fungerar
 */
@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public Map<String, String> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Test controller fungerar!");
        response.put("status", "OK");
        return response;
    }

    @GetMapping("/jobs")
    public Map<String, String> testJobs() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Jobs endpoint test fungerar!");
        response.put("status", "OK");
        return response;
    }
}
