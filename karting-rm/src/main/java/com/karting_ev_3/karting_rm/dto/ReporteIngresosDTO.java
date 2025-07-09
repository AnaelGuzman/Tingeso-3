package com.karting_ev_3.karting_rm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReporteIngresosDTO {
    private String categoria;
    private Integer cantidadReservas;
    private Double ingresoBruto;
    private Double ingresoNeto;
    private Double ingresoIva;
    private Double ingresoTotal;
    private Double porcentajeDelTotal;
}