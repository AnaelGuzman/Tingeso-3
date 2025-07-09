package com.karting_ev_3.karting_rm.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "descuento_frecuencia")
public class DescuentoFrecuencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private Integer frecuencia;
    private Double descuento;

    public DescuentoFrecuencia(String nombre, Integer frecuencia, Double descuento) {
        this.nombre = nombre;
        this.frecuencia = frecuencia;
        this.descuento = descuento;
    }
}
