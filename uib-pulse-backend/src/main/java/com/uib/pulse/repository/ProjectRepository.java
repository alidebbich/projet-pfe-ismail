package com.uib.pulse.repository;

import com.uib.pulse.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByDirection(String direction);

    List<Project> findByStatus(Project.ProjectStatus status);

    List<Project> findByDirectionAndStatus(String direction, Project.ProjectStatus status);

    @Query("SELECT p FROM Project p WHERE " +
           "(:direction IS NULL OR p.direction = :direction) AND " +
           "(:phase IS NULL OR p.phase = :phase) AND " +
           "(:status IS NULL OR p.status = :status)")
    List<Project> findFiltered(
        @Param("direction") String direction,
        @Param("phase") String phase,
        @Param("status") Project.ProjectStatus status
    );

    @Query("SELECT COUNT(p) FROM Project p WHERE p.status = 'COMPLETED'")
    long countDeployed();

    @Query("SELECT COUNT(p) FROM Project p WHERE p.status = 'DELAYED'")
    long countDelayed();
}
