package com.pme.catalogue.service;

import com.pme.catalogue.dto.ProfilUtilisateurDTO;
import com.pme.catalogue.model.ProfilUtilisateur;
import com.pme.catalogue.repository.ProfilUtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfilUtilisateurService {

    private final ProfilUtilisateurRepository repository;

    public ProfilUtilisateurDTO getProfil(String username) {
        return repository.findById(username)
                .map(this::toDTO)
                .orElse(ProfilUtilisateurDTO.builder().username(username).build());
    }

    public ProfilUtilisateurDTO saveProfil(String username, ProfilUtilisateurDTO dto) {
        ProfilUtilisateur profil = repository.findById(username)
                .orElse(ProfilUtilisateur.builder().username(username).build());
        profil.setAvatarUrl(dto.getAvatarUrl());
        profil.setBio(dto.getBio());
        profil.setVille(dto.getVille());
        profil.setPrenom(dto.getPrenom());
        profil.setNom(dto.getNom());
        return toDTO(repository.save(profil));
    }

    private ProfilUtilisateurDTO toDTO(ProfilUtilisateur p) {
        return ProfilUtilisateurDTO.builder()
                .username(p.getUsername())
                .avatarUrl(p.getAvatarUrl())
                .bio(p.getBio())
                .ville(p.getVille())
                .prenom(p.getPrenom())
                .nom(p.getNom())
                .build();
    }
}