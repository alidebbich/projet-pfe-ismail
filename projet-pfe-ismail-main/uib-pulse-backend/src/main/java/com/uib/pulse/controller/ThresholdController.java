package com.uib.pulse.controller;

import com.uib.pulse.entity.KpiThreshold;
import com.uib.pulse.service.AuditService;
import com.uib.pulse.service.ThresholdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/thresholds")
@RequiredArgsConstructor
public class ThresholdController {
    private final ThresholdService thresholdService;
    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<List<KpiThreshold>> getAll() {
        return ResponseEntity.ok(thresholdService.getAll());
    }

    @PutMapping("/{kpiCode}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<KpiThreshold> update(
            @PathVariable String kpiCode,
            @RequestBody KpiThreshold thresholdData,
            Authentication auth
    ) {
        KpiThreshold updated = thresholdService.update(kpiCode, thresholdData, auth.getName());
        auditService.log(auth.getName(), "UPDATE_THRESHOLD", "THRESHOLD", updated.getId(), "Updated threshold for " + kpiCode);
        return ResponseEntity.ok(updated);
    }
}
