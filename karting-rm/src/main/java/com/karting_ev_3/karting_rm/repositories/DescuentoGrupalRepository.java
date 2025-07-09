package com.karting_ev_3.karting_rm.repositories;

import com.karting_ev_3.karting_rm.entities.DescuentoGrupal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DescuentoGrupalRepository extends JpaRepository<DescuentoGrupal, Long> {
}
