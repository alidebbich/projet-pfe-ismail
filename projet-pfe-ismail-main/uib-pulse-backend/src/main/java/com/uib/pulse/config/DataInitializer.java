package com.uib.pulse.config;

import com.uib.pulse.entity.User;
import com.uib.pulse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("Admin@2024"))
                    .fullName("Administrateur UIB")
                    .email("admin@uib.com.tn")
                    .role(User.Role.ROLE_ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            System.out.println("[UIB Pulse] Admin user created: admin / Admin@2024");
        }
    }
}
