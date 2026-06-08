package com.uib.pulse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "data_quality_records")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DataQualityRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String sourceSystem;

    @Column(nullable = false, length = 50)
    private String period;

    @Column(nullable = false)
    private Long totalRecordsControlled;

    @Column(nullable = false)
    private Long validRecords;

    @Column(length = 100)
    private String dataType;

    @Column(length = 500)
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
