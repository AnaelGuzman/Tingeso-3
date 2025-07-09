package com.karting_ev_3.karting_rm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReporteCompletoDTO {
    private String tipoReporte;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private LocalDate fechaGeneracion;
    private Double ingresoTotalPeriodo;
    private Integer totalReservas;
    private java.util.List<ReporteIngresosDTO> detalles;
}