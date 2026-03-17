package com.pme.catalogue.repository;

import com.pme.catalogue.model.ProfilUtilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfilUtilisateurRepository extends JpaRepository<ProfilUtilisateur, String> {
}