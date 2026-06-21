package com.uib.pulse.repository;

import com.uib.pulse.entity.KpiEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface KpiEntryRepository extends JpaRepository<KpiEntry, Long> {

    List<KpiEntry> findByKpiCodeOrderByDateDesc(String kpiCode);

    List<KpiEntry> findByKpiCodeAndDirectionOrderByDateDesc(String kpiCode, String direction);

    Optional<KpiEntry> findTopByKpiCodeOrderByDateDesc(String kpiCode);

    @Query("SELECT k FROM KpiEntry k WHERE k.kpiCode = :code AND k.date BETWEEN :from AND :to ORDER BY k.date ASC")
    List<KpiEntry> findByCodeAndDateRange(
        @Param("code") String code,
        @Param("from") LocalDate from,
        @Param("to") LocalDate to
    );
}
