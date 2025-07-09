package com.karting_ev_3.karting_rm.controllers;

import com.karting_ev_3.karting_rm.dto.TarifasDTO;
import com.karting_ev_3.karting_rm.entities.Tarifas;
import com.karting_ev_3.karting_rm.services.TarifasServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tarifas")
@CrossOrigin("*")
public class TarifasController {
    @Autowired
    TarifasServices tarifasServices;

    @GetMapping
    public List<TarifasDTO> findAll(){
        return tarifasServices.findAll();
    }
    @GetMapping("/{id}")
    public Tarifas findById(@PathVariable Long id){
        return tarifasServices.findById(id);
    }
    @PostMapping
    public Tarifas save(@RequestBody Tarifas tarifas){
        return tarifasServices.save(tarifas);
    }
    @PutMapping("/{id}")
    public Tarifas update(@PathVariable Long id, @RequestBody Tarifas tarifas){
        tarifas.setId(id);
        return tarifasServices.updateTarifa(id,tarifas);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        tarifasServices.deleteById(id);
    }
    @GetMapping("/turn/weekend/{mul}")
    public void weekendTarifas(@PathVariable Double mul){ tarifasServices.tarifasFinDeSemana(mul);}
    @PostMapping("/inicializar")
    public void inicializar(){
        tarifasServices.inicializarTarifasBasicas();
    }
}
