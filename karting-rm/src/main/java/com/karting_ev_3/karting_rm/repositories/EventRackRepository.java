package com.karting_ev_3.karting_rm.repositories;

import com.karting_ev_3.karting_rm.entities.EventRack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface EventRackRepository extends JpaRepository<EventRack, Long> {
    boolean existsByIdReserva(Long idReserva);

    @Query("SELECT e FROM EventRack e WHERE " +
            "e.fechaEvento = :fecha AND " +
            "((e.horaInicio < :horaFin AND e.horaFin > :horaInicio) OR " +
            "(e.horaInicio = :horaInicio AND e.horaFin = :horaFin))")
    List<EventRack> findOverlappingEvents(
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin
    );

    @Query("SELECT e FROM EventRack e WHERE " +
            "e.fechaEvento = :fecha AND " +
            "((e.horaInicio < :horaFin AND e.horaFin > :horaInicio) OR " +
            "(e.horaInicio = :horaInicio AND e.horaFin = :horaFin)) AND " +
            "e.id <> :excludeId")
    List<EventRack> findOverlappingEventsExcludingId(
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin,
            @Param("excludeId") Long excludeId
    );
}
