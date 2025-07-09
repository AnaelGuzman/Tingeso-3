package com.karting_ev_3.karting_rm.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tarifas_especiales")
public class TarifasEspeciales {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private Integer dia;
    private Integer mes;
    private String vueltas;
    private String tiempo;
    private String duracion;
    private Double preciosRegulares;

    public TarifasEspeciales(String nombre, Integer dia, Integer mes, String vueltas, String tiempo, String duracion, Double preciosRegulares) {
        this.nombre = nombre;
        this.dia = dia;
        this.mes = mes;
        this.vueltas = vueltas;
        this.tiempo = tiempo;
        this.duracion = duracion;
        this.preciosRegulares = preciosRegulares;
    }
}
