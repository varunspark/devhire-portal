package com.devhire.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CompanyDto {
    private Long id;

    @NotBlank(message = "Company name is required")
    private String name;

    private String description;
    private String website;
    private String location;
}
