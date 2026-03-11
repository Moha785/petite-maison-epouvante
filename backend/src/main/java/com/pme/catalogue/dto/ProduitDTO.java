package com.pme.catalogue.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProduitDTO {

    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    private String description;

    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.0", message = "Le prix doit être positif")
    private BigDecimal prix;

    @NotNull(message = "Le stock est obligatoire")
    @Min(value = 0, message = "Le stock doit être positif")
    private Integer stock;

    @NotBlank(message = "La catégorie est obligatoire")
    private String categorie;

    private String imageUrl;
    private Boolean disponible;
}