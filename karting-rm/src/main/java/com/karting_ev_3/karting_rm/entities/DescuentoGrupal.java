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
@Table(name = "descuentos_grupales")
public class DescuentoGrupal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private Integer minPersonas;
    private Integer maxPersonas;
    private Double descuento;

    public DescuentoGrupal(String nombre, Integer minPersonas, Integer maxPersonas, Double descuento) {
        this.nombre = nombre;
        this.minPersonas = minPersonas;
        this.maxPersonas = maxPersonas;
        this.descuento = descuento;
    }
}
