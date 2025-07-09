package com.karting_ev_3.karting_rm.repositories;

import com.karting_ev_3.karting_rm.entities.Tarifas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TarifasRepository extends JpaRepository<Tarifas,Long> {
}
