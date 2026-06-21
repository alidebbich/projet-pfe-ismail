package com.uib.pulse.entity;

import com.uib.pulse.security.AesEncryptor;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String username;

    @Column(nullable = false)
    private String password;  // BCrypt hashed

    @Convert(converter = AesEncryptor.class)
    @Column(nullable = false, length = 500)
    private String fullName;

    @Convert(converter = AesEncryptor.class)
    @Column(unique = true, length = 500)
    private String email;

    /**
     * Role: ROLE_MANAGER (read-only dashboards + export)
     *       ROLE_ADMIN   (full CRUD + user management + audit)
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.ROLE_MANAGER;

    @Column(nullable = false)
    private boolean enabled = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum Role {
        ROLE_MANAGER,
        ROLE_ADMIN
    }
}
