package com.devhire.service;

import com.devhire.dto.JobDto;
import com.devhire.entity.Company;
import com.devhire.entity.Job;
import com.devhire.entity.JobType;
import com.devhire.exception.ResourceNotFoundException;
import com.devhire.repository.CompanyRepository;
import com.devhire.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    public List<JobDto> getAll() {
        return jobRepository.findAll().stream().map(this::toDto).toList();
    }

    public List<JobDto> getActive() {
        return jobRepository.findByActiveTrue().stream().map(this::toDto).toList();
    }

    public JobDto getById(Long id) {
        return toDto(findEntity(id));
    }

    public JobDto create(JobDto dto) {
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + dto.getCompanyId()));

        Job job = Job.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .salary(dto.getSalary())
                .jobType(parseJobType(dto.getJobType()))
                .company(company)
                .active(dto.getActive() == null || dto.getActive())
                .build();

        return toDto(jobRepository.save(job));
    }

    public JobDto update(Long id, JobDto dto) {
        Job job = findEntity(id);

        if (dto.getCompanyId() != null && !dto.getCompanyId().equals(job.getCompany().getId())) {
            Company company = companyRepository.findById(dto.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + dto.getCompanyId()));
            job.setCompany(company);
        }

        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setLocation(dto.getLocation());
        job.setSalary(dto.getSalary());
        job.setJobType(parseJobType(dto.getJobType()));
        if (dto.getActive() != null) job.setActive(dto.getActive());

        return toDto(jobRepository.save(job));
    }

    public void delete(Long id) {
        Job job = findEntity(id);
        jobRepository.delete(job);
    }

    private Job findEntity(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
    }

    private JobType parseJobType(String type) {
        try {
            return JobType.valueOf(type.toUpperCase().replace(" ", "_"));
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid job type: " + type);
        }
    }

    private JobDto toDto(Job j) {
        return JobDto.builder()
                .id(j.getId())
                .title(j.getTitle())
                .description(j.getDescription())
                .location(j.getLocation())
                .salary(j.getSalary())
                .jobType(j.getJobType() != null ? j.getJobType().name() : null)
                .companyId(j.getCompany().getId())
                .companyName(j.getCompany().getName())
                .active(j.getActive())
                .build();
    }
}
