package com.uib.pulse.service;

import com.uib.pulse.entity.AuditLog;
import com.uib.pulse.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    /**
     * Log an action asynchronously — fire-and-forget so it never blocks API responses.
     */
    @Async
    @SuppressWarnings("null")
    public void log(String username, String action, String entityType, Long entityId, String detail) {
        String ip = null;
        String userAgent = null;

        try {
            ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                ip = getClientIp(request);
                userAgent = request.getHeader("User-Agent");
            }
        } catch (Exception ignored) {}

        AuditLog entry = AuditLog.builder()
            .username(username)
            .action(action)
            .entityType(entityType)
            .entityId(entityId)
            .detail(detail)
            .ipAddress(ip)
            .userAgent(userAgent)
            .build();

        auditLogRepository.save(entry);
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
