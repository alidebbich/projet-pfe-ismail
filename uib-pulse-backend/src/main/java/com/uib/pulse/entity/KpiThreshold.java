package com.uib.pulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "kpi_thresholds")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class KpiThreshold {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String kpiCode;

    @Column(nullable = false)
    private Double greenThreshold;

    @Column(nullable = false)
    private Double orangeLowerBound;

    @Column(nullable = false)
    private Double redUpperBound;

    @Column(nullable = false)
    private LocalDate effectiveDate;

    @Column(length = 100)
    private String savedBy;
}
