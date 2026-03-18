package com.pme.catalogue.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnonceDTO {
    private Long id;
    private String titre;
    private String description;
    private String categorie;
    private String username;
    private String imageUrl;
    private LocalDateTime createdAt;
}