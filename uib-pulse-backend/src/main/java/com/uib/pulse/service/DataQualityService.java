package com.uib.pulse.service;

import com.uib.pulse.entity.DataQualityRecord;
import com.uib.pulse.repository.DataQualityRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DataQualityService {
    private final DataQualityRecordRepository repository;

    public List<DataQualityRecord> getAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public DataQualityRecord getById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Record not found"));
    }

    public DataQualityRecord create(DataQualityRecord record) {
        return repository.save(record);
    }

    public DataQualityRecord update(Long id, DataQualityRecord record) {
        DataQualityRecord existing = getById(id);
        existing.setSourceSystem(record.getSourceSystem());
        existing.setPeriod(record.getPeriod());
        existing.setTotalRecordsControlled(record.getTotalRecordsControlled());
        existing.setValidRecords(record.getValidRecords());
        existing.setDataType(record.getDataType());
        existing.setNotes(record.getNotes());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
