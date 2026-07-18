package com.devhire.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class JobDto {
    private Long id;

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    private String location;

    @PositiveOrZero(message = "Salary must be zero or positive")
    private Double salary;

    @NotBlank(message = "Job type is required")
    private String jobType;

    @NotNull(message = "Company id is required")
    private Long companyId;

    private String companyName;
    private Boolean active;
}
