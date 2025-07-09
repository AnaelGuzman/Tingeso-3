package com.karting_ev_3.karting_rm.repositories;

import com.karting_ev_3.karting_rm.entities.TarifasEspeciales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TarifasEspecialesRepository extends JpaRepository<TarifasEspeciales, Long> {
    TarifasEspeciales findByDiaAndMes(Integer dia, Integer mes);
}
