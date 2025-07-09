package com.karting_ev_3.karting_rm.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tarifas")
public class Tarifas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String vueltas;
    private String tiempo;
    private Double preciosRegulares;
    private String duracionTotal;

    public Tarifas(String nombre,String vueltas , String tiempo,Double preciosRegulares,String duracionTotal) {
        this.nombre = nombre;
        this.vueltas = vueltas;
        this.tiempo = tiempo;
        this.preciosRegulares = preciosRegulares;
        this.duracionTotal = duracionTotal;
    }
}
