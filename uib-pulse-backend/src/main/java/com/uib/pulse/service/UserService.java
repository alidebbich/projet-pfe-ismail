package com.uib.pulse.service;

import com.uib.pulse.entity.User;
import com.uib.pulse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAll() {
        return repository.findAll();
    }

    public User getById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User create(User user) {
        if (repository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return repository.save(user);
    }

    public User update(Long id, User updatedUser) {
        User existing = getById(id);
        existing.setFullName(updatedUser.getFullName());
        existing.setEmail(updatedUser.getEmail());
        if (updatedUser.getRole() != null) {
            existing.setRole(updatedUser.getRole());
        }
        existing.setEnabled(updatedUser.isEnabled());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
