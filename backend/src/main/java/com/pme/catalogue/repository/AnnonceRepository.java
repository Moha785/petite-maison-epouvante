package com.pme.catalogue.repository;

import com.pme.catalogue.model.Annonce;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnnonceRepository extends JpaRepository<Annonce, Long> {
    List<Annonce> findAllByOrderByCreatedAtDesc();
    List<Annonce> findByUsernameOrderByCreatedAtDesc(String username);
}