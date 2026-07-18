package com.devhire.service;

import com.devhire.dto.CompanyDto;
import com.devhire.entity.Company;
import com.devhire.exception.ResourceNotFoundException;
import com.devhire.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public List<CompanyDto> getAll() {
        return companyRepository.findAll().stream().map(this::toDto).toList();
    }

    public CompanyDto getById(Long id) {
        return toDto(findEntity(id));
    }

    public CompanyDto create(CompanyDto dto) {
        Company company = Company.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .website(dto.getWebsite())
                .location(dto.getLocation())
                .build();
        return toDto(companyRepository.save(company));
    }

    public CompanyDto update(Long id, CompanyDto dto) {
        Company company = findEntity(id);
        company.setName(dto.getName());
        company.setDescription(dto.getDescription());
        company.setWebsite(dto.getWebsite());
        company.setLocation(dto.getLocation());
        return toDto(companyRepository.save(company));
    }

    public void delete(Long id) {
        Company company = findEntity(id);
        companyRepository.delete(company);
    }

    private Company findEntity(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
    }

    private CompanyDto toDto(Company c) {
        return CompanyDto.builder()
                .id(c.getId())
                .name(c.getName())
                .description(c.getDescription())
                .website(c.getWebsite())
                .location(c.getLocation())
                .build();
    }
}
