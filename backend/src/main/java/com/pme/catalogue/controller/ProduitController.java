package com.pme.catalogue.controller;

import com.pme.catalogue.dto.ProduitDTO;
import com.pme.catalogue.service.ProduitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/produits")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProduitController {

    private final ProduitService produitService;

    @GetMapping
    public ResponseEntity<List<ProduitDTO>> getAll() {
        return ResponseEntity.ok(produitService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduitDTO> getById(@PathVariable Long id) {
        return produitService.getProduitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recherche")
    public ResponseEntity<List<ProduitDTO>> rechercher(
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String categorie,
            @RequestParam(required = false) Boolean disponible) {
        return ResponseEntity.ok(produitService.rechercher(nom, categorie, disponible));
    }

    @PostMapping
    public ResponseEntity<ProduitDTO> create(@Valid @RequestBody ProduitDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(produitService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProduitDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody ProduitDTO dto) {
        return ResponseEntity.ok(produitService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        produitService.delete(id);
        return ResponseEntity.noContent().build();
    }
}