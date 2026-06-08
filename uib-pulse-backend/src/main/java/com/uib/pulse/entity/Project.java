package com.uib.pulse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    /**
     * Type of project: SI (Système d'information), Infrastructure, Transformation, etc.
     */
    @Column(length = 100)
    private String type;

    /**
     * Current phase: Cadrage, Développement, Recette, Déploiement, Production
     */
    @Column(length = 50)
    private String phase;

    /**
     * Status: ON_TRACK, AT_RISK, DELAYED, COMPLETED, CANCELLED
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status = ProjectStatus.ON_TRACK;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date_planned")
    private LocalDate endDatePlanned;

    @Column(name = "end_date_actual")
    private LocalDate endDateActual;

    /**
     * Organizational direction: DSI, DCR, DRM, DOSI
     */
    @Column(length = 50)
    private String direction;

    @Column(length = 500)
    private String description;

    @Column(name = "budget_planned")
    private Double budgetPlanned;

    @Column(name = "budget_consumed")
    private Double budgetConsumed;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ProjectStatus {
        ON_TRACK, AT_RISK, DELAYED, COMPLETED, CANCELLED
    }
}
