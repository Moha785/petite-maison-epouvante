package com.pme.catalogue.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfilUtilisateurDTO {
    private String username;
    private String avatarUrl;
    private String bio;
    private String ville;
    private String prenom;
    private String nom;
}