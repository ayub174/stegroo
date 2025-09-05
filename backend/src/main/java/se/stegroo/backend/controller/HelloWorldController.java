package se.stegroo.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * En enkel controller för att testa att applikationen fungerar.
 */
@RestController
public class HelloWorldController {

    @GetMapping("/api/hello")
    public Map<String, String> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from Stegroo Backend!");
        response.put("status", "running");
        return response;
    }
    
    @GetMapping("/api/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        return response;
    }
}
