package com.uib.pulse.controller;

import com.uib.pulse.entity.User;
import com.uib.pulse.repository.UserRepository;
import com.uib.pulse.service.AuditService;
import com.uib.pulse.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        String username = auth.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = userOpt.get();
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates, Authentication auth) {
        String username = auth.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = userOpt.get();
        
        if (updates.containsKey("fullName") && !updates.get("fullName").trim().isEmpty()) {
            user.setFullName(updates.get("fullName"));
        }
        if (updates.containsKey("email") && !updates.get("email").trim().isEmpty()) {
            user.setEmail(updates.get("email"));
        }
        if (updates.containsKey("password") && !updates.get("password").trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updates.get("password")));
        }

        userRepository.save(user);
        auditService.log(username, "UPDATE_PROFILE", "USER", user.getId(), "User updated profile");
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    // ADMIN ENDPOINTS
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAll();
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(users);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(@RequestBody User user, Authentication auth) {
        User saved = userService.create(user);
        auditService.log(auth.getName(), "CREATE_USER", "USER", saved.getId(), "Admin created user: " + saved.getUsername());
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user, Authentication auth) {
        User updated = userService.update(id, user);
        auditService.log(auth.getName(), "UPDATE_USER", "USER", id, "Admin updated user: " + updated.getUsername());
        updated.setPassword(null);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, Authentication auth) {
        userService.delete(id);
        auditService.log(auth.getName(), "DELETE_USER", "USER", id, "Admin deleted user: " + id);
        return ResponseEntity.noContent().build();
    }
}
