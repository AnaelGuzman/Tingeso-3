package com.karting_ev_3.karting_rm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioDTO {
    private Long id;
    private String rut;
    private String nombre;
    private String apellido;
    private String email;
    private LocalDate fechaNacimiento;
    private LocalDate ultimaVisita;
    private Integer visitas;
}
