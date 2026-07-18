package com.devhire.service;

import com.devhire.dto.JobApplicationDto;
import com.devhire.entity.Job;
import com.devhire.entity.JobApplication;
import com.devhire.entity.User;
import com.devhire.exception.DuplicateResourceException;
import com.devhire.exception.ResourceNotFoundException;
import com.devhire.repository.JobApplicationRepository;
import com.devhire.repository.JobRepository;
import com.devhire.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobApplicationDto apply(Long jobId, String username, String resumeLink) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        applicationRepository.findByJobIdAndApplicantId(jobId, user.getId()).ifPresent(a -> {
            throw new DuplicateResourceException("You have already applied to this job");
        });

        JobApplication application = JobApplication.builder()
                .job(job)
                .applicant(user)
                .resumeLink(resumeLink)
                .build();

        return toDto(applicationRepository.save(application));
    }

    public List<JobApplicationDto> getMyApplications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return applicationRepository.findByApplicantId(user.getId()).stream().map(this::toDto).toList();
    }

    public List<JobApplicationDto> getAll() {
        return applicationRepository.findAll().stream().map(this::toDto).toList();
    }

    public List<JobApplicationDto> getForJob(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream().map(this::toDto).toList();
    }

    public JobApplicationDto updateStatus(Long applicationId, String status) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));
        try {
            application.setStatus(com.devhire.entity.ApplicationStatus.valueOf(status.toUpperCase()));
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
        return toDto(applicationRepository.save(application));
    }

    private JobApplicationDto toDto(JobApplication a) {
        return JobApplicationDto.builder()
                .id(a.getId())
                .jobId(a.getJob().getId())
                .jobTitle(a.getJob().getTitle())
                .applicantId(a.getApplicant().getId())
                .applicantUsername(a.getApplicant().getUsername())
                .resumeLink(a.getResumeLink())
                .status(a.getStatus().name())
                .appliedDate(a.getAppliedDate())
                .build();
    }
}
