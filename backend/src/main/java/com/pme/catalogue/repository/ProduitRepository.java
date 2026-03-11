package com.pme.catalogue.repository;

import com.pme.catalogue.model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {

    // Recherche par catégorie
    List<Produit> findByCategorie(String categorie);

    // Recherche par disponibilité
    List<Produit> findByDisponible(Boolean disponible);

    // Recherche par nom (contient, insensible à la casse)
    List<Produit> findByNomContainingIgnoreCase(String nom);

    // Recherche combinée nom + catégorie
    @Query("SELECT p FROM Produit p WHERE " +
           "(:nom IS NULL OR LOWER(p.nom) LIKE LOWER(CONCAT('%', :nom, '%'))) AND " +
           "(:categorie IS NULL OR p.categorie = :categorie) AND " +
           "(:disponible IS NULL OR p.disponible = :disponible)")
    List<Produit> rechercher(
        @Param("nom") String nom,
        @Param("categorie") String categorie,
        @Param("disponible") Boolean disponible
    );
}