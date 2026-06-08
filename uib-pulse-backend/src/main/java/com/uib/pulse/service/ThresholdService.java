package com.uib.pulse.service;

import com.uib.pulse.entity.KpiThreshold;
import com.uib.pulse.repository.KpiThresholdRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ThresholdService {
    private final KpiThresholdRepository repository;

    public List<KpiThreshold> getAll() {
        return repository.findAll();
    }

    public KpiThreshold update(String kpiCode, KpiThreshold updatedData, String username) {
        KpiThreshold threshold = repository.findByKpiCode(kpiCode).orElse(new KpiThreshold());
        threshold.setKpiCode(kpiCode);
        threshold.setGreenThreshold(updatedData.getGreenThreshold());
        threshold.setOrangeLowerBound(updatedData.getOrangeLowerBound());
        threshold.setRedUpperBound(updatedData.getRedUpperBound());
        threshold.setEffectiveDate(LocalDate.now());
        threshold.setSavedBy(username);
        return repository.save(threshold);
    }
}
