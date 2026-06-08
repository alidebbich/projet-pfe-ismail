package com.uib.pulse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String username;

    /**
     * Action performed: CREATE_PROJECT, UPDATE_KPI, DELETE_TICKET, LOGIN, EXPORT_DATA, etc.
     */
    @Column(nullable = false, length = 100)
    private String action;

    /**
     * Entity type affected: PROJECT, KPI_ENTRY, TICKET, USER
     */
    @Column(name = "entity_type", length = 50)
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "detail", length = 1000)
    private String detail;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 300)
    private String userAgent;

    @CreationTimestamp
    @Column(name = "timestamp", updatable = false)
    private LocalDateTime timestamp;
}
