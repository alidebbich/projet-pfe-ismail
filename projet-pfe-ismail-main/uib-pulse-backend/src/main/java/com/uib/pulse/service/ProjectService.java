package com.uib.pulse.service;

import com.uib.pulse.entity.Project;
import com.uib.pulse.repository.ProjectRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<Project> getAll() {
        return projectRepository.findAll();
    }

    public List<Project> getFiltered(String direction, String phase, Project.ProjectStatus status) {
        return projectRepository.findFiltered(direction, phase, status);
    }

    public Project getById(@NonNull Long id) {
        return projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project not found: " + id));
    }

    @Transactional
    public Project create(@NonNull Project project) {
        return Objects.requireNonNull(projectRepository.save(project),
            "save() returned null for project");
    }

    @Transactional
    public Project update(Long id, Project updated) {
        Project existing = getById(id);
        existing.setName(updated.getName());
        existing.setType(updated.getType());
        existing.setPhase(updated.getPhase());
        existing.setStatus(updated.getStatus());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDatePlanned(updated.getEndDatePlanned());
        existing.setEndDateActual(updated.getEndDateActual());
        existing.setDirection(updated.getDirection());
        existing.setDescription(updated.getDescription());
        existing.setBudgetPlanned(updated.getBudgetPlanned());
        existing.setBudgetConsumed(updated.getBudgetConsumed());
        return projectRepository.save(existing);
    }

    @Transactional
    public void delete(@NonNull Long id) {
        projectRepository.deleteById(id);
    }

    /**
     * KPI-P2 calculation: Taux de déploiement = (Deployed / Total) * 100
     */
    public Map<String, Object> getDeploymentRate() {
        long total = projectRepository.count();
        long deployed = projectRepository.countDeployed();
        long delayed = projectRepository.countDelayed();

        double rate = total > 0 ? (deployed * 100.0 / total) : 0.0;
        String status = rate >= 90 ? "green" : rate >= 75 ? "orange" : "red";

        return Map.of(
            "code", "KPI-P2",
            "label", "Taux de Déploiement",
            "value", Math.round(rate * 10.0) / 10.0,
            "numerator", deployed,
            "denominator", total,
            "delayed", delayed,
            "status", status
        );
    }
}
