package com.karting_ev_3.karting_rm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservaDTO {
    private Long id;
    private LocalDate fechaReserva;
    private LocalTime horaInicioReserva;
    private LocalTime horaFinReserva;
    private String tarifaEscogida;
    private Double precioNeto;
    private Double precioIva;
    private Double valorFinal;
}
