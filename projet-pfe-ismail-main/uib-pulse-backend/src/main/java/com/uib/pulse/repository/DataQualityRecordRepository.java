package com.uib.pulse.repository;

import com.uib.pulse.entity.DataQualityRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DataQualityRecordRepository extends JpaRepository<DataQualityRecord, Long> {
    List<DataQualityRecord> findAllByOrderByCreatedAtDesc();
}
