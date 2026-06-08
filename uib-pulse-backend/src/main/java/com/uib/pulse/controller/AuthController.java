package com.uib.pulse.controller;

import com.uib.pulse.entity.User;
import com.uib.pulse.entity.PasswordResetToken;
import com.uib.pulse.repository.UserRepository;
import com.uib.pulse.repository.PasswordResetTokenRepository;
import com.uib.pulse.security.JwtTokenProvider;
import com.uib.pulse.service.AuditService;
import com.uib.pulse.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    @Value("${app.google.client-id}")
    private String googleClientId;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
            String actualUsername = authentication.getName();
            String token = jwtTokenProvider.generateToken(authentication);

            User user = userRepository.findByUsername(actualUsername).orElseThrow();
            auditService.log(actualUsername, "LOGIN", "USER", user.getId(), "Successful login");

            return ResponseEntity.ok(Map.of(
                "token", token,
                "username", actualUsername,
                "role", user.getRole().name(),
                "fullName", user.getFullName()
            ));

        } catch (BadCredentialsException e) {
            auditService.log(username, "LOGIN_FAILED", "USER", null, "Invalid credentials");
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/register")
    @SuppressWarnings("null")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
        }

        User user = User.builder()
            .username(username)
            .password(passwordEncoder.encode(request.get("password")))
            .fullName(request.getOrDefault("fullName", username))
            .email(request.get("email"))
            .role(User.Role.valueOf(request.getOrDefault("role", "ROLE_MANAGER")))
            .enabled(true)
            .build();

        User saved = userRepository.save(user);
        auditService.log("SYSTEM", "CREATE_USER", "USER", saved.getId(), "Created user: " + username);

        return ResponseEntity.ok(Map.of("message", "User created", "username", username));
    }

    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        userRepository.findByEmail(email).ifPresent(user -> {
            tokenRepository.deleteByUser(user);
            
            String token = java.util.UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken(token, user);
            tokenRepository.save(resetToken);
            
            String resetLink = "http://localhost:5173/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(email, resetLink);
            
            auditService.log(email, "FORGOT_PASSWORD", "USER", user.getId(), "Password reset requested");
        });
        
        return ResponseEntity.ok(Map.of("message", "Si l'adresse email existe, un lien de réinitialisation a été envoyé."));
    }

    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Le token et le nouveau mot de passe sont requis."));
        }

        var tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lien de réinitialisation invalide ou introuvable."));
        }

        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            return ResponseEntity.badRequest().body(Map.of("error", "Le lien a expiré. Veuillez refaire une demande."));
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        tokenRepository.delete(resetToken);
        auditService.log(user.getUsername(), "RESET_PASSWORD", "USER", user.getId(), "Password reset successful");

        return ResponseEntity.ok(Map.of("message", "Votre mot de passe a été réinitialisé avec succès."));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(Authentication auth) {
        if (auth != null) {
            auditService.log(auth.getName(), "LOGOUT", "USER", null, "Successful logout");
        }
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    // Google Login kept for backward compatibility, but we will mostly use Email/Pass
    @PostMapping("/google")
    @SuppressWarnings("null")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        String idTokenString = request.get("idToken");
        if (idTokenString == null || idTokenString.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "idToken is required"));
        }

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                User user = userRepository.findByUsername(email).orElseGet(() -> {
                    User newUser = User.builder()
                        .username(email)
                        .password("") 
                        .fullName(name != null ? name : email)
                        .email(email)
                        .role(User.Role.ROLE_MANAGER)
                        .enabled(true)
                        .build();
                    User saved = userRepository.save(newUser);
                    auditService.log("SYSTEM", "REGISTER_GOOGLE", "USER", saved.getId(), "Registered via Google: " + email);
                    return saved;
                });

                String token = jwtTokenProvider.generateTokenFromUsername(user.getUsername());
                auditService.log(user.getUsername(), "LOGIN_GOOGLE", "AUTH", user.getId(), "Google Sign-In successful");

                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", user.getUsername(),
                    "role", user.getRole().name(),
                    "fullName", user.getFullName()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid ID token."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Token verification failed"));
        }
    }
}
