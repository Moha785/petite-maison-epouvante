package com.pme.catalogue.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profils_utilisateurs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfilUtilisateur {

    @Id
    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(name = "bio")
    private String bio;

    @Column(name = "ville")
    private String ville;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "nom")
    private String nom;
}