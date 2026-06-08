package com.uib.pulse.controller;

import com.uib.pulse.entity.Ticket;
import com.uib.pulse.service.AuditService;
import com.uib.pulse.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final AuditService auditService;

    /** GET /api/tickets */
    @GetMapping
    public ResponseEntity<List<Ticket>> getAll(
        @RequestParam(required = false) String direction
    ) {
        if (direction != null) {
            return ResponseEntity.ok(ticketService.getByDirection(direction));
        }
        return ResponseEntity.ok(ticketService.getAll());
    }

    /**
     * GET /api/tickets/sla-stats?from=2026-06-01&to=2026-06-30
     * Returns KPI-D2 calculation
     */
    @GetMapping("/sla-stats")
    public ResponseEntity<Map<String, Object>> getSlaStats(
        @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().withDayOfMonth(1)}")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(defaultValue = "#{T(java.time.LocalDate).now()}")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return ResponseEntity.ok(ticketService.getSlaStats(from, to));
    }

    /** POST /api/tickets */
    @PostMapping
    public ResponseEntity<Ticket> create(
        @RequestBody Ticket ticket,
        Authentication auth
    ) {
        Ticket saved = ticketService.create(ticket);
        auditService.log(auth.getName(), "CREATE_TICKET", "TICKET", saved.getId(),
            "Created ticket: " + saved.getTicketRef());
        return ResponseEntity.ok(saved);
    }

    /** PUT /api/tickets/{id}/close?closingDate=2026-06-08 */
    @PutMapping("/{id}/close")
    public ResponseEntity<Ticket> close(
        @PathVariable Long id,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closingDate,
        Authentication auth
    ) {
        Ticket closed = ticketService.close(id, closingDate);
        auditService.log(auth.getName(), "CLOSE_TICKET", "TICKET", id,
            "Closed ticket id: " + id + ", J+1=" + closed.getResolvedJ1());
        return ResponseEntity.ok(closed);
    }
}
