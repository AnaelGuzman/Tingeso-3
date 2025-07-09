package com.karting_ev_3.karting_rm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TarifasDTO {
    private Long id;
    private String nombre;
    private String vueltas;
    private String tiempo;
    private Double preciosRegulares;
    private String duracionTotal;
}
