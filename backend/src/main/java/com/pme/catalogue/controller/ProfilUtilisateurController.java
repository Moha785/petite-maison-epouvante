package com.pme.catalogue.controller;

import com.pme.catalogue.dto.ProfilUtilisateurDTO;
import com.pme.catalogue.service.ProfilUtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profil")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfilUtilisateurController {

    private final ProfilUtilisateurService service;

    @GetMapping("/{username}")
    public ResponseEntity<ProfilUtilisateurDTO> getProfil(@PathVariable String username) {
        return ResponseEntity.ok(service.getProfil(username));
    }

    @PutMapping("/{username}")
    public ResponseEntity<ProfilUtilisateurDTO> updateProfil(
            @PathVariable String username,
            @RequestBody ProfilUtilisateurDTO dto) {
        return ResponseEntity.ok(service.saveProfil(username, dto));
    }
}