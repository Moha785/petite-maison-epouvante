package com.pme.catalogue.service;

import com.pme.catalogue.dto.ProduitDTO;
import com.pme.catalogue.model.Produit;
import com.pme.catalogue.repository.ProduitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProduitService {

    private final ProduitRepository produitRepository;

    public List<ProduitDTO> findAll() {
        return produitRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProduitDTO findById(Long id) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé : " + id));
        return toDTO(produit);
    }

    public Optional<ProduitDTO> getProduitById(Long id) {
        return produitRepository.findById(id).map(this::toDTO);
    }

    public List<ProduitDTO> rechercher(String nom, String categorie, Boolean disponible) {
        return produitRepository.rechercher(nom, categorie, disponible)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProduitDTO create(ProduitDTO dto) {
        Produit produit = toEntity(dto);
        return toDTO(produitRepository.save(produit));
    }

    public ProduitDTO update(Long id, ProduitDTO dto) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé : " + id));
        produit.setNom(dto.getNom());
        produit.setDescription(dto.getDescription());
        produit.setPrix(dto.getPrix());
        produit.setStock(dto.getStock());
        produit.setCategorie(dto.getCategorie());
        produit.setImageUrl(dto.getImageUrl());
        produit.setDisponible(dto.getDisponible());
        return toDTO(produitRepository.save(produit));
    }

    public void delete(Long id) {
        if (!produitRepository.existsById(id)) {
            throw new RuntimeException("Produit non trouvé : " + id);
        }
        produitRepository.deleteById(id);
    }

    private ProduitDTO toDTO(Produit p) {
        return ProduitDTO.builder()
                .id(p.getId())
                .nom(p.getNom())
                .description(p.getDescription())
                .prix(p.getPrix())
                .stock(p.getStock())
                .categorie(p.getCategorie())
                .imageUrl(p.getImageUrl())
                .disponible(p.getDisponible())
                .build();
    }

    private Produit toEntity(ProduitDTO dto) {
        return Produit.builder()
                .nom(dto.getNom())
                .description(dto.getDescription())
                .prix(dto.getPrix())
                .stock(dto.getStock())
                .categorie(dto.getCategorie())
                .imageUrl(dto.getImageUrl())
                .disponible(dto.getDisponible() != null ? dto.getDisponible() : true)
                .build();
    }
}