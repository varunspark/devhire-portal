package com.devhire.controller;

import com.devhire.dto.ApplyRequest;
import com.devhire.dto.JobApplicationDto;
import com.devhire.service.JobApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Tag(name = "Applications", description = "Apply for jobs and track applications")
public class JobApplicationController {

    private final JobApplicationService applicationService;

    @PostMapping("/jobs/{jobId}")
    @Operation(summary = "Apply for a job (authenticated users)")
    public ResponseEntity<JobApplicationDto> apply(@PathVariable Long jobId,
                                                     @Valid @RequestBody ApplyRequest request,
                                                     Authentication authentication) {
        JobApplicationDto dto = applicationService.apply(jobId, authentication.getName(), request.getResumeLink());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping("/my")
    @Operation(summary = "Get the current user's applications")
    public ResponseEntity<List<JobApplicationDto>> getMyApplications(Authentication authentication) {
        return ResponseEntity.ok(applicationService.getMyApplications(authentication.getName()));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all applications (ADMIN)")
    public ResponseEntity<List<JobApplicationDto>> getAll() {
        return ResponseEntity.ok(applicationService.getAll());
    }

    @GetMapping("/jobs/{jobId}")
    @Operation(summary = "Get all applications for a specific job (ADMIN)")
    public ResponseEntity<List<JobApplicationDto>> getForJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getForJob(jobId));
    }

    @PatchMapping("/{applicationId}/status")
    @Operation(summary = "Update an application's status (ADMIN)")
    public ResponseEntity<JobApplicationDto> updateStatus(@PathVariable Long applicationId,
                                                            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(applicationService.updateStatus(applicationId, body.get("status")));
    }
}
