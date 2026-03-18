package com.pme.catalogue.service;

import com.pme.catalogue.dto.AnnonceDTO;
import com.pme.catalogue.model.Annonce;
import com.pme.catalogue.repository.AnnonceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AnnonceService {

    private final AnnonceRepository repository;

    public List<AnnonceDTO> findAll() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AnnonceDTO> findByUsername(String username) {
        return repository.findByUsernameOrderByCreatedAtDesc(username)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public AnnonceDTO create(AnnonceDTO dto) {
        Annonce annonce = Annonce.builder()
                .titre(dto.getTitre())
                .description(dto.getDescription())
                .categorie(dto.getCategorie())
                .username(dto.getUsername())
                .imageUrl(dto.getImageUrl())
                .build();
        return toDTO(repository.save(annonce));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private AnnonceDTO toDTO(Annonce a) {
        return AnnonceDTO.builder()
                .id(a.getId())
                .titre(a.getTitre())
                .description(a.getDescription())
                .categorie(a.getCategorie())
                .username(a.getUsername())
                .imageUrl(a.getImageUrl())
                .createdAt(a.getCreatedAt())
                .build();
    }
}