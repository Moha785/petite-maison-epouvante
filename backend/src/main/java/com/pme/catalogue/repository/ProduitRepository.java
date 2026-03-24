package com.pme.catalogue.repository;

import com.pme.catalogue.model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
    List<Produit> findByCategorie(String categorie);
    List<Produit> findByDisponible(Boolean disponible);
    List<Produit> findByNomContainingIgnoreCase(String nom);
}