package com.karting_ev_3.karting_rm.controllers;

import com.karting_ev_3.karting_rm.entities.DescuentoFrecuencia;
import com.karting_ev_3.karting_rm.entities.Reserva;
import com.karting_ev_3.karting_rm.entities.Usuarios;
import com.karting_ev_3.karting_rm.services.DescuentoFrecuenciaServices;
import com.karting_ev_3.karting_rm.services.ReservaServices;
import com.karting_ev_3.karting_rm.services.UsuariosServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/descuentos-frecuencia")
@CrossOrigin("*")
public class DescuentoFrecuenciaController {

    @Autowired
    private DescuentoFrecuenciaServices descuentoFrecuenciaServices;

    @Autowired
    private UsuariosServices usuariosServices;

    @Autowired
    private ReservaServices reservaServices;

    // Obtener todos los descuentos por frecuencia
    @GetMapping
    public ResponseEntity<List<DescuentoFrecuencia>> getAllDescuentosFrecuencia() {
        List<DescuentoFrecuencia> descuentos = descuentoFrecuenciaServices.findAllDescuentoFrecuencias();
        return ResponseEntity.ok(descuentos);
    }

    // Obtener un descuento por frecuencia por ID
    @GetMapping("/{id}")
    public ResponseEntity<DescuentoFrecuencia> getDescuentoFrecuenciaById(@PathVariable Long id) {
        DescuentoFrecuencia descuento = descuentoFrecuenciaServices.findById(id);
        return ResponseEntity.ok(descuento);
    }

    // Eliminar un descuento por frecuencia
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDescuentoFrecuencia(@PathVariable Long id) {
        descuentoFrecuenciaServices.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Calcular descuento por frecuencia para un usuario y reserva
    @PostMapping("/asignar")
    public ResponseEntity<?> asignarDescuentoFrecuencia(
            @RequestParam Long userId,
            @RequestParam Long reservaId) {
        try {
            Usuarios usuario = usuariosServices.findById(userId);
            Reserva reserva = reservaServices.findReserva(reservaId);

            DescuentoFrecuencia descuento = descuentoFrecuenciaServices.asignarDescuentoFrecuencia(usuario, reserva);
            return ResponseEntity.ok(descuento);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al asignar descuento: " + e.getMessage());
        }
    }
}
