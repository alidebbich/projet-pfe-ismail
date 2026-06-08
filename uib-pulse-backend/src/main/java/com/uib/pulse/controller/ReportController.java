package com.uib.pulse.controller;

import com.uib.pulse.service.AuditService;
import com.uib.pulse.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final AuditService auditService;

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<byte[]> generateReport(
            @RequestBody Map<String, String> requestBody,
            Authentication auth
    ) {
        String type = requestBody.getOrDefault("type", "GLOBAL");
        String format = requestBody.getOrDefault("format", "pdf");
        LocalDate from = LocalDate.parse(requestBody.getOrDefault("from", LocalDate.now().minusMonths(1).toString()));
        LocalDate to = LocalDate.parse(requestBody.getOrDefault("to", LocalDate.now().toString()));

        try {
            byte[] fileBytes;
            String filename;
            MediaType mediaType;

            if ("excel".equalsIgnoreCase(format)) {
                fileBytes = reportService.generateExcelReport(type, from, to);
                filename = "rapport_" + type.toLowerCase() + ".xlsx";
                mediaType = MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            } else {
                fileBytes = reportService.generatePdfReport(type, from, to);
                filename = "rapport_" + type.toLowerCase() + ".pdf";
                mediaType = MediaType.APPLICATION_PDF;
            }

            auditService.log(auth.getName(), "GENERATE_REPORT", "REPORT", 0L, "Generated " + format + " report for " + type);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(mediaType)
                    .body(fileBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
