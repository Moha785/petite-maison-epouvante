package com.pme.catalogue.controller;

import com.pme.catalogue.dto.AnnonceDTO;
import com.pme.catalogue.service.AnnonceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/annonces")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnnonceController {

    private final AnnonceService service;

    @GetMapping
    public ResponseEntity<List<AnnonceDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<AnnonceDTO>> getByUsername(@PathVariable String username) {
        return ResponseEntity.ok(service.findByUsername(username));
    }

    @PostMapping
    public ResponseEntity<AnnonceDTO> create(@RequestBody AnnonceDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}