package com.uib.pulse.repository;

import com.uib.pulse.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByStatus(Ticket.TicketStatus status);

    List<Ticket> findByPriorityAndStatus(Ticket.Priority priority, Ticket.TicketStatus status);

    List<Ticket> findByLevel(Ticket.SupportLevel level);

    List<Ticket> findByDirection(String direction);

    /**
     * KPI-D2: Count Critical tickets closed within J+1
     */
    @Query("SELECT COUNT(t) FROM Ticket t " +
           "WHERE t.priority = 'CRITICAL' " +
           "AND t.status = 'CLOSED' " +
           "AND t.resolvedJ1 = true " +
           "AND t.openingDate BETWEEN :from AND :to")
    long countCriticalClosedJ1(@Param("from") LocalDate from, @Param("to") LocalDate to);

    /**
     * Total critical tickets in period
     */
    @Query("SELECT COUNT(t) FROM Ticket t " +
           "WHERE t.priority = 'CRITICAL' " +
           "AND t.openingDate BETWEEN :from AND :to")
    long countCritical(@Param("from") LocalDate from, @Param("to") LocalDate to);

    /**
     * SLA stats grouped by level
     */
    @Query("SELECT t.level, COUNT(t), SUM(CASE WHEN t.resolvedJ1 = true THEN 1 ELSE 0 END) " +
           "FROM Ticket t WHERE t.priority = 'CRITICAL' " +
           "GROUP BY t.level")
    List<Object[]> slaStatsByLevel();
}
