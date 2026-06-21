package com.uib.pulse.controller;

import com.uib.pulse.entity.AuditLog;
import com.uib.pulse.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/audit")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AuditController {

    private final AuditLogRepository auditLogRepository;

    /** GET /api/audit — paginated audit log */
    @GetMapping
    @SuppressWarnings("null")
    public ResponseEntity<Page<AuditLog>> getAll(
        @PageableDefault(size = 50, sort = "timestamp", direction = Sort.Direction.DESC)
        Pageable pageable
    ) {
        return ResponseEntity.ok(auditLogRepository.findAll(pageable));
    }

    /** GET /api/audit?username=admin */
    @GetMapping("/by-user")
    public ResponseEntity<Page<AuditLog>> getByUser(
        @RequestParam String username,
        @PageableDefault(size = 50) Pageable pageable
    ) {
        return ResponseEntity.ok(
            auditLogRepository.findByUsernameOrderByTimestampDesc(username, pageable)
        );
    }

    /** GET /api/audit/range?from=...&to=... */
    @GetMapping("/range")
    public ResponseEntity<List<AuditLog>> getByDateRange(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return ResponseEntity.ok(
            auditLogRepository.findByTimestampBetweenOrderByTimestampDesc(from, to)
        );
    }
}
