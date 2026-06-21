package com.uib.pulse.controller;

import com.uib.pulse.entity.DataQualityRecord;
import com.uib.pulse.service.AuditService;
import com.uib.pulse.service.DataQualityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/data-quality")
@RequiredArgsConstructor
public class DataQualityController {
    private final DataQualityService dataQualityService;
    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<List<DataQualityRecord>> getAll() {
        return ResponseEntity.ok(dataQualityService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DataQualityRecord> getById(@PathVariable Long id) {
        return ResponseEntity.ok(dataQualityService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<DataQualityRecord> create(@RequestBody DataQualityRecord record, Authentication auth) {
        DataQualityRecord saved = dataQualityService.create(record);
        auditService.log(auth.getName(), "CREATE_DATA_QUALITY", "DATA_QUALITY", saved.getId(), "Created record for " + saved.getPeriod());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<DataQualityRecord> update(@PathVariable Long id, @RequestBody DataQualityRecord record, Authentication auth) {
        DataQualityRecord updated = dataQualityService.update(id, record);
        auditService.log(auth.getName(), "UPDATE_DATA_QUALITY", "DATA_QUALITY", id, "Updated record for " + updated.getPeriod());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        dataQualityService.delete(id);
        auditService.log(auth.getName(), "DELETE_DATA_QUALITY", "DATA_QUALITY", id, "Deleted record");
        return ResponseEntity.noContent().build();
    }
}
