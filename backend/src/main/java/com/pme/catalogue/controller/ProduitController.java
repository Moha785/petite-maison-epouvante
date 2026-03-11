package com.pme.catalogue.controller;

import com.pme.catalogue.dto.ProduitDTO;
import com.pme.catalogue.service.ProduitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/produits")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ProduitController {

    private final ProduitService produitService;

    // ── PUBLIC : tout le monde peut voir le catalogue ──

    @GetMapping
    public ResponseEntity<List<ProduitDTO>> getAll() {
        return ResponseEntity.ok(produitService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduitDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(produitService.findById(id));
    }

    @GetMapping("/recherche")
    public ResponseEntity<List<ProduitDTO>> rechercher(
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String categorie,
            @RequestParam(required = false) Boolean disponible) {
        return ResponseEntity.ok(produitService.rechercher(nom, categorie, disponible));
    }

    // ── ADMIN ONLY : création, modification, suppression ──

    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ProduitDTO> create(@Valid @RequestBody ProduitDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(produitService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ProduitDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody ProduitDTO dto) {
        return ResponseEntity.ok(produitService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        produitService.delete(id);
        return ResponseEntity.noContent().build();
    }
}