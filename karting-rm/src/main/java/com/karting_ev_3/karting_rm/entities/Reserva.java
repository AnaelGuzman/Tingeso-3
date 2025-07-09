package com.karting_ev_3.karting_rm.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reservas")
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate fechaReserva;
    private LocalTime horaInicioReserva;
    private LocalTime horaFinReserva;
    //tarifa para la reserva
    private String tarifaEscogida;//nombre tarifa: general, fin de semana, especial,etc
    private String vueltas;
    private String tiempo;
    private Double valorTarifaEscogida;
    //valores tarifa
    private Double precioNeto;
    private Double precioIva;
    private Double valorFinal;
    //usuarios
    @ManyToMany
    @JoinTable(
            name = "usuarios_reserva",
            joinColumns = @JoinColumn(name = "reserva_id"),
            inverseJoinColumns = @JoinColumn(name = "usuario_id"))
    @JsonIgnoreProperties("reserva") // Evita recursión
    private List<Usuarios> usuarios = new ArrayList<>();
}
