package com.karting_ev_3.karting_rm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReporteRequestDTO {
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String tipoReporte; // "VUELTAS_TIEMPO" o "NUMERO_PERSONAS"
}
