package com.karting_ev_3.karting_rm.controllers;

import com.karting_ev_3.karting_rm.entities.DescuentoGrupal;
import com.karting_ev_3.karting_rm.entities.Usuarios;
import com.karting_ev_3.karting_rm.services.DescuentoGrupalServices;
import com.karting_ev_3.karting_rm.services.UsuariosServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/descuentos-grupales")
@CrossOrigin("*")
public class DescuentoGrupalController {

    @Autowired
    private DescuentoGrupalServices descuentoGrupalServices;
    @Autowired
    private UsuariosServices usuariosServices;

    // Obtener todos los descuentos grupales
    @GetMapping
    public ResponseEntity<List<DescuentoGrupal>> getAllDescuentosGrupales() {
        List<DescuentoGrupal> descuentos = descuentoGrupalServices.getAllDescuentoGrupal();
        return ResponseEntity.ok(descuentos);
    }

    // Obtener un descuento grupal por ID
    @GetMapping("/{id}")
    public ResponseEntity<DescuentoGrupal> getDescuentoGrupalById(@PathVariable Long id) {
        DescuentoGrupal descuento = descuentoGrupalServices.getDescuentoGrupalById(id);
        return ResponseEntity.ok(descuento);
    }

    // Eliminar un descuento grupal por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDescuentoGrupalById(@PathVariable Long id) {
        descuentoGrupalServices.deleteDescuentoGrupalById(id);
        return ResponseEntity.noContent().build();
    }

    // Buscar/crear descuento grupal según tamaño de grupo
    @PostMapping("/asignar")
    public ResponseEntity<DescuentoGrupal> asignarDescuentoGrupal(
            @RequestParam Long userId,
            @RequestParam Integer tamanioGrupo) {
        Usuarios user = usuariosServices.findById(userId);
        DescuentoGrupal descuento = descuentoGrupalServices.asignarDescuentoGrupal(user, tamanioGrupo);
        return ResponseEntity.ok(descuento);
    }
}