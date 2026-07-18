package com.devhire.repository;

import com.devhire.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByApplicantId(Long userId);
    List<JobApplication> findByJobId(Long jobId);
    Optional<JobApplication> findByJobIdAndApplicantId(Long jobId, Long userId);
}
