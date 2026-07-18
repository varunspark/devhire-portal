package com.devhire.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class JobApplicationDto {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long applicantId;
    private String applicantUsername;
    private String resumeLink;
    private String status;
    private LocalDateTime appliedDate;
}
