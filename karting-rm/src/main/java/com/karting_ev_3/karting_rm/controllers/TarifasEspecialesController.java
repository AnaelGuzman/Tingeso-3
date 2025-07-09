package com.karting_ev_3.karting_rm.controllers;

import com.karting_ev_3.karting_rm.entities.TarifasEspeciales;
import com.karting_ev_3.karting_rm.services.TarifasEspecialesServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tarifas-especiales")
@CrossOrigin("*")
public class TarifasEspecialesController {

    @Autowired
    private TarifasEspecialesServices tarifasEspecialesServices;

    // Obtener todas las tarifas especiales
    @GetMapping
    public List<TarifasEspeciales> findAll() {
        return tarifasEspecialesServices.findAll();
    }

    // Obtener tarifa especial por ID
    @GetMapping("/{id}")
    public TarifasEspeciales findById(@PathVariable Long id) {
        return tarifasEspecialesServices.findById(id);
    }

    // Buscar tarifa por día y mes (ej: eventos)
    @GetMapping("/buscar")
    public TarifasEspeciales findByDate(@RequestParam Integer dia, @RequestParam Integer mes) {
        return tarifasEspecialesServices.findByDate(dia, mes);
    }

    // Crear nueva tarifa especial
    @PostMapping
    public TarifasEspeciales save(@RequestBody TarifasEspeciales tarifa) {
        return tarifasEspecialesServices.save(tarifa);
    }

    // Actualizar tarifa especial por ID
    @PutMapping("/{id}")
    public TarifasEspeciales update(@PathVariable Long id, @RequestBody TarifasEspeciales tarifaDetails) {
        return tarifasEspecialesServices.updateTarifaEspecial(id, tarifaDetails);
    }

    // Eliminar tarifa especial por ID
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        tarifasEspecialesServices.deleteById(id);
    }

    // Inicializar tarifas especiales predefinidas (reset)
    @PostMapping("/inicializar")
    public void inicializarTarifas() {
        tarifasEspecialesServices.inicializarTarifasEspeciales();
    }
}

