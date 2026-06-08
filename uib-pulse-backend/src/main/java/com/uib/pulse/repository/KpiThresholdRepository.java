package com.uib.pulse.repository;

import com.uib.pulse.entity.KpiThreshold;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KpiThresholdRepository extends JpaRepository<KpiThreshold, Long> {
    Optional<KpiThreshold> findByKpiCode(String kpiCode);
}
