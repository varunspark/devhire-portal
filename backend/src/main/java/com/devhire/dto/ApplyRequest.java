package com.devhire.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ApplyRequest {
    @NotBlank(message = "Resume link is required")
    private String resumeLink;
}
