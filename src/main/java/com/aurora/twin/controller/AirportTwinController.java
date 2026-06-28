package com.aurora.twin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/twin")
public class AirportTwinController {

    private static final Logger logger = LoggerFactory.getLogger(AirportTwinController.class);

    /**
     * Mock Service to represent DeepSeek API call
     */
    @PostMapping("/optimize-gate")
    public ResponseEntity<Map<String, Object>> optimizeGate(@RequestBody Map<String, Object> request) {
        String flightNo = (String) request.getOrDefault("flightNo", "CA1832");
        String crowdDensity = (String) request.getOrDefault("crowdDensity", "HIGH");
        String availableGates = (String) request.getOrDefault("availableGates", "Gate 12, Gate 15, Gate 18");

        logger.info("Optimizing gate allocation for Flight: {}, Terminal density: {}, Available: {}", 
            flightNo, crowdDensity, availableGates);

        // Simulate DeepSeek-V3 allocation decision
        Map<String, Object> response = new HashMap<>();
        response.put("flightNo", flightNo);
        response.put("allocatedGate", "Gate 15");
        response.put("confidence", 0.96);
        response.put("reason", "Gate 15 is closest to the low-density baggage claim area, reducing terminal crowding.");
        response.put("status", "SUCCESS");

        return ResponseEntity.ok(response);
    }

    /**
     * Heartbeat check for 3D Front-end telemetry WebSocket handshake
     */
    @GetMapping("/heartbeat")
    public ResponseEntity<Map<String, String>> heartbeat() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("websocket_gateway", "ws://localhost:8080/ws/airport");
        status.put("uptime", "365 days");
        return ResponseEntity.ok(status);
    }
}
