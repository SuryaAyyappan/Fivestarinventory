package com.emart.inventory.controller;

import com.emart.inventory.entity.User;
import com.emart.inventory.service.UserService;
import com.emart.inventory.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");
            return userService.findByUsername(username)
                    .filter(user -> userService.checkPassword(password, user.getPassword()))
                    .map(user -> {
                        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
                        Map<String, Object> response = new HashMap<>();
                        response.put("token", token);
                        response.put("role", user.getRole().name());
                        response.put("username", user.getUsername());
                        return ResponseEntity.ok(response);
                    })
                    .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {
        try {
            String username = registerRequest.get("username");
            String password = registerRequest.get("password");
            String role = registerRequest.get("role");
            if (username == null || password == null || role == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing fields"));
            }
            if (userService.findByUsername(username).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
            }
            User newUser = userService.createUser(username, password, role);
            return ResponseEntity.ok(Map.of(
                "message", "User registered successfully",
                "username", newUser.getUsername(),
                "role", newUser.getRole().name()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
} 