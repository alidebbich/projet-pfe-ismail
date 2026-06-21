package com.uib.pulse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "kpi_entries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class KpiEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * KPI code per UIB CDC: KPI-P2, KPI-D2, KPI-P10, etc.
     */
    @Column(name = "kpi_code", nullable = false, length = 20)
    private String kpiCode;

    @Column(nullable = false)
    private Double value;

    @Column(nullable = false)
    private LocalDate date;

    /**
     * Unit: %, count, days, etc.
     */
    @Column(length = 20)
    private String unit;

    /**
     * Source system: ORACLE, MYSQL, EXCEL, MANUAL
     */
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private DataSource dataSource = DataSource.MANUAL;

    /**
     * Organizational direction filter
     */
    @Column(length = 50)
    private String direction;

    @Column(length = 500)
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum DataSource {
        ORACLE, MYSQL, EXCEL, MANUAL
    }
}
