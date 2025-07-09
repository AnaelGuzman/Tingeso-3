package com.karting_ev_3.karting_rm.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuarios")
public class Usuarios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String rut;
    private String nombre;
    private String apellido;
    private String email;
    private LocalDate  fechaNacimiento;
    private LocalDate ultimaVisita;
    private Integer visitas;
    private String nombreDescuento;
    private Double porcentajeDescuento;
    private Double tarifaFinal;// tarifa calculada personalmente para el usuario
    @ManyToMany(mappedBy = "usuarios")
    @JsonIgnoreProperties("usuarios") // Evita recursión
    private List<Reserva> reserva = new ArrayList<>();


    public Usuarios(String rut, String nombre, String apellido, String email, LocalDate fechaNacimiento, LocalDate ultimaVisita, Integer visitas) {
        this.rut = rut;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.fechaNacimiento = fechaNacimiento;
        this.ultimaVisita = ultimaVisita;
        this.visitas = visitas;
    }
}
