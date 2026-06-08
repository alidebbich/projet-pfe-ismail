package com.uib.pulse.service;

import com.uib.pulse.entity.Ticket;
import com.uib.pulse.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TicketService {

    private final TicketRepository ticketRepository;

    public List<Ticket> getAll() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getByDirection(String direction) {
        return ticketRepository.findByDirection(direction);
    }

    @Transactional
    public Ticket create(Ticket ticket) {
        // Auto-compute resolvedJ1 on creation if already closed
        if (ticket.getClosingDate() != null && ticket.getOpeningDate() != null) {
            long daysDiff = ticket.getClosingDate().toEpochDay() - ticket.getOpeningDate().toEpochDay();
            ticket.setResolvedJ1(daysDiff <= 1);
        }
        return ticketRepository.save(ticket);
    }

    @Transactional
    @SuppressWarnings("null")
    public Ticket close(Long id, LocalDate closingDate) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found: " + id));
        ticket.setClosingDate(closingDate);
        ticket.setStatus(Ticket.TicketStatus.CLOSED);
        long daysDiff = closingDate.toEpochDay() - ticket.getOpeningDate().toEpochDay();
        ticket.setResolvedJ1(daysDiff <= 1);
        return ticketRepository.save(ticket);
    }

    /**
     * KPI-D2: SLA E-Ticketing — Critical tickets closed within J+1
     * Formula: (Critical tickets closed J+1 / Total critical tickets) * 100
     */
    public Map<String, Object> getSlaStats(LocalDate from, LocalDate to) {
        long total = ticketRepository.countCritical(from, to);
        long closedJ1 = ticketRepository.countCriticalClosedJ1(from, to);

        double rate = total > 0 ? (closedJ1 * 100.0 / total) : 0.0;
        String status = rate >= 90 ? "green" : rate >= 75 ? "orange" : "red";

        // Per-level breakdown
        List<Object[]> levelStats = ticketRepository.slaStatsByLevel();
        List<Map<String, Object>> byLevel = levelStats.stream().map(row -> {
            long lvlTotal = ((Number) row[1]).longValue();
            long lvlClosed = ((Number) row[2]).longValue();
            double lvlRate = lvlTotal > 0 ? (lvlClosed * 100.0 / lvlTotal) : 0.0;
            return Map.<String, Object>of(
                "level", row[0].toString(),
                "total", lvlTotal,
                "closedJ1", lvlClosed,
                "rate", Math.round(lvlRate * 10.0) / 10.0
            );
        }).toList();

        return Map.of(
            "code", "KPI-D2",
            "label", "SLA E-Ticketing",
            "value", Math.round(rate * 10.0) / 10.0,
            "criticalTotal", total,
            "criticalClosedJ1", closedJ1,
            "status", status,
            "byLevel", byLevel,
            "period", Map.of("from", from.toString(), "to", to.toString())
        );
    }
}
