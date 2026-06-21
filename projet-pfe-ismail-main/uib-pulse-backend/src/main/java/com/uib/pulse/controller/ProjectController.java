package com.uib.pulse.controller;

import com.uib.pulse.entity.Project;
import com.uib.pulse.service.AuditService;
import com.uib.pulse.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final AuditService auditService;

    /** GET /api/projects — list all, optional filters */
    @GetMapping
    public ResponseEntity<List<Project>> getAll(
        @RequestParam(required = false) String direction,
        @RequestParam(required = false) String phase,
        @RequestParam(required = false) Project.ProjectStatus status
    ) {
        return ResponseEntity.ok(
            (direction != null || phase != null || status != null)
                ? projectService.getFiltered(direction, phase, status)
                : projectService.getAll()
        );
    }

    /** GET /api/projects/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<Project> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getById(id));
    }

    /** GET /api/projects/kpi/deployment-rate — KPI-P2 */
    @GetMapping("/kpi/deployment-rate")
    public ResponseEntity<Map<String, Object>> getDeploymentRate() {
        return ResponseEntity.ok(projectService.getDeploymentRate());
    }

    /** POST /api/projects */
    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Project> create(
        @RequestBody Project project,
        Authentication auth
    ) {
        Project saved = projectService.create(project);
        auditService.log(auth.getName(), "CREATE_PROJECT", "PROJECT", saved.getId(),
            "Created project: " + saved.getName());
        return ResponseEntity.ok(saved);
    }

    /** PUT /api/projects/{id} */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Project> update(
        @PathVariable Long id,
        @RequestBody Project project,
        Authentication auth
    ) {
        Project updated = projectService.update(id, project);
        auditService.log(auth.getName(), "UPDATE_PROJECT", "PROJECT", id,
            "Updated project: " + updated.getName());
        return ResponseEntity.ok(updated);
    }

    /** DELETE /api/projects/{id} */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        auditService.log(auth.getName(), "DELETE_PROJECT", "PROJECT", id,
            "Deleted project id: " + id);
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
