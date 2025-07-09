package com.karting_ev_3.karting_rm.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "rack_semanal")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventRack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate fechaEvento;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String mensaje;
    private Long idReserva;
}
