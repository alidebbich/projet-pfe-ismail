package com.uib.pulse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_ref", length = 50)
    private String ticketRef;

    @Column(length = 500)
    private String title;

    /**
     * Priority: CRITICAL, HIGH, MEDIUM, LOW
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    /**
     * Status: OPEN, IN_PROGRESS, RESOLVED, CLOSED
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status = TicketStatus.OPEN;

    @Column(name = "opening_date", nullable = false)
    private LocalDate openingDate;

    @Column(name = "closing_date")
    private LocalDate closingDate;

    /**
     * Support level: N1 (first line) or N2 (second line)
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SupportLevel level;

    /**
     * Direction that raised the ticket
     */
    @Column(length = 50)
    private String direction;

    /**
     * Resolved within J+1 (next business day) — computed on close
     */
    @Column(name = "resolved_j1")
    private Boolean resolvedJ1;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum Priority {
        CRITICAL, HIGH, MEDIUM, LOW
    }

    public enum TicketStatus {
        OPEN, IN_PROGRESS, RESOLVED, CLOSED
    }

    public enum SupportLevel {
        N1, N2
    }
}
