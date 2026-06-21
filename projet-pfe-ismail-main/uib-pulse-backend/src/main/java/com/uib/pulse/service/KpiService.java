package com.uib.pulse.service;

import com.uib.pulse.entity.KpiEntry;
import com.uib.pulse.repository.KpiEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class KpiService {

    private final KpiEntryRepository kpiEntryRepository;

    public List<KpiEntry> getByCode(String code) {
        return kpiEntryRepository.findByKpiCodeOrderByDateDesc(code);
    }

    public List<KpiEntry> getByCodeAndDirection(String code, String direction) {
        return kpiEntryRepository.findByKpiCodeAndDirectionOrderByDateDesc(code, direction);
    }

    public List<KpiEntry> getHistory(String code, LocalDate from, LocalDate to) {
        return kpiEntryRepository.findByCodeAndDateRange(code, from, to);
    }

    public Optional<KpiEntry> getLatest(String code) {
        return kpiEntryRepository.findTopByKpiCodeOrderByDateDesc(code);
    }

    @Transactional
    public KpiEntry manualInput(KpiEntry entry) {
        entry.setDataSource(KpiEntry.DataSource.MANUAL);
        return kpiEntryRepository.save(entry);
    }

    /**
     * Returns a unified KPI dashboard summary for the React frontend.
     * Includes computed status (green/orange/red) per UIB CDC thresholds.
     */
    public Map<String, Object> getDashboardSummary(String direction) {
        // Fetch latest values for each main KPI
        Optional<KpiEntry> p2 = direction != null
            ? kpiEntryRepository.findByKpiCodeAndDirectionOrderByDateDesc("KPI-P2", direction).stream().findFirst()
            : kpiEntryRepository.findTopByKpiCodeOrderByDateDesc("KPI-P2");

        Optional<KpiEntry> d2 = direction != null
            ? kpiEntryRepository.findByKpiCodeAndDirectionOrderByDateDesc("KPI-D2", direction).stream().findFirst()
            : kpiEntryRepository.findTopByKpiCodeOrderByDateDesc("KPI-D2");

        Optional<KpiEntry> p10 = direction != null
            ? kpiEntryRepository.findByKpiCodeAndDirectionOrderByDateDesc("KPI-P10", direction).stream().findFirst()
            : kpiEntryRepository.findTopByKpiCodeOrderByDateDesc("KPI-P10");

        return Map.of(
            "KPI-P2",  kpiSummary("KPI-P2",  "Taux de Déploiement", p2,  90.0, 75.0),
            "KPI-D2",  kpiSummary("KPI-D2",  "SLA E-Ticketing",     d2,  90.0, 75.0),
            "KPI-P10", kpiSummary("KPI-P10", "Anomalies Critiques",  p10, 90.0, 75.0)
        );
    }

    private Map<String, Object> kpiSummary(
        String code, String label, Optional<KpiEntry> entry,
        double greenThreshold, double orangeThreshold
    ) {
        if (entry.isEmpty()) {
            return Map.of("code", code, "label", label, "status", "no-data");
        }
        double value = entry.get().getValue();
        String status = value >= greenThreshold ? "green"
                      : value >= orangeThreshold ? "orange"
                      : "red";
        return Map.of(
            "code",   code,
            "label",  label,
            "value",  value,
            "unit",   entry.get().getUnit() != null ? entry.get().getUnit() : "%",
            "date",   entry.get().getDate().toString(),
            "status", status
        );
    }
}
