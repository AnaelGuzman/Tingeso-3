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
@Table(name = "descuento_cumpleanios")
public class DescuentoCumpleanios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private Double descuento;

    public DescuentoCumpleanios (String nombre, Double descuento) {
        this.nombre = nombre;
        this.descuento = descuento;
    }
}
