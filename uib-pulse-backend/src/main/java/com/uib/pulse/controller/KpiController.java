package com.uib.pulse.controller;

import com.uib.pulse.entity.KpiEntry;
import com.uib.pulse.service.AuditService;
import com.uib.pulse.service.KpiService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/kpis")
@RequiredArgsConstructor
public class KpiController {

    private final KpiService kpiService;
    private final AuditService auditService;

    /** GET /api/kpis/summary — unified dashboard summary for Power BI / React */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary(
        @RequestParam(required = false) String direction
    ) {
        return ResponseEntity.ok(kpiService.getDashboardSummary(direction));
    }

    /** GET /api/kpis/{code} — latest entry for a specific KPI code */
    @GetMapping("/{code}")
    public ResponseEntity<?> getByCode(
        @PathVariable String code,
        @RequestParam(required = false) String direction
    ) {
        if (direction != null) {
            return ResponseEntity.ok(kpiService.getByCodeAndDirection(code, direction));
        }
        return ResponseEntity.ok(kpiService.getByCode(code));
    }

    /** GET /api/kpis/{code}/history?from=2026-01-01&to=2026-06-30 */
    @GetMapping("/{code}/history")
    public ResponseEntity<List<KpiEntry>> getHistory(
        @PathVariable String code,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return ResponseEntity.ok(kpiService.getHistory(code, from, to));
    }

    /**
     * POST /api/kpis/manual — MANAGER or ADMIN can manually input Excel-based KPIs
     */
    @PostMapping("/manual")
    public ResponseEntity<KpiEntry> manualInput(
        @RequestBody KpiEntry entry,
        Authentication auth
    ) {
        KpiEntry saved = kpiService.manualInput(entry);
        auditService.log(
            auth.getName(), "MANUAL_KPI_INPUT", "KPI_ENTRY", saved.getId(),
            "Manual input for " + saved.getKpiCode() + " = " + saved.getValue()
        );
        return ResponseEntity.ok(saved);
    }
}
