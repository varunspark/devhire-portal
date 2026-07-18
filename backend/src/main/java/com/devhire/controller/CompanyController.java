package com.devhire.controller;

import com.devhire.dto.CompanyDto;
import com.devhire.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@Tag(name = "Companies", description = "Company CRUD endpoints (write access: ADMIN only)")
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    @Operation(summary = "List all companies")
    public ResponseEntity<List<CompanyDto>> getAll() {
        return ResponseEntity.ok(companyService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a company by id")
    public ResponseEntity<CompanyDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Create a company (ADMIN)")
    public ResponseEntity<CompanyDto> create(@Valid @RequestBody CompanyDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(companyService.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a company (ADMIN)")
    public ResponseEntity<CompanyDto> update(@PathVariable Long id, @Valid @RequestBody CompanyDto dto) {
        return ResponseEntity.ok(companyService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a company (ADMIN)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        companyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
