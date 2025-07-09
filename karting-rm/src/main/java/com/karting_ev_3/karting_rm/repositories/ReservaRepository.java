package com.karting_ev_3.karting_rm.repositories;

import com.karting_ev_3.karting_rm.entities.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByFechaReservaBetween(LocalDate fechaInicio, LocalDate fechaFin);
    List<Reserva> findByFechaReservaBetweenAndVueltas(LocalDate fechaInicio, LocalDate fechaFin, String vueltas);
}
