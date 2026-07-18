package com.devhire.controller;

import com.devhire.dto.JobDto;
import com.devhire.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Tag(name = "Jobs", description = "Job CRUD endpoints (write access: ADMIN only)")
public class JobController {

    private final JobService jobService;

    @GetMapping
    @Operation(summary = "List all active jobs")
    public ResponseEntity<List<JobDto>> getAll() {
        return ResponseEntity.ok(jobService.getActive());
    }

    @GetMapping("/all")
    @Operation(summary = "List all jobs including inactive (ADMIN view)")
    public ResponseEntity<List<JobDto>> getAllIncludingInactive() {
        return ResponseEntity.ok(jobService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a job by id")
    public ResponseEntity<JobDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Create a job (ADMIN)")
    public ResponseEntity<JobDto> create(@Valid @RequestBody JobDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a job (ADMIN)")
    public ResponseEntity<JobDto> update(@PathVariable Long id, @Valid @RequestBody JobDto dto) {
        return ResponseEntity.ok(jobService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a job (ADMIN)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        jobService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
