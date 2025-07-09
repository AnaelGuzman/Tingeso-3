package com.karting_ev_3.karting_rm.services;

import com.karting_ev_3.karting_rm.dto.TarifasDTO;
import com.karting_ev_3.karting_rm.entities.Tarifas;
import com.karting_ev_3.karting_rm.repositories.TarifasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TarifasServices {
    @Autowired
    TarifasRepository tarifasRepository;
    //toDTO
    public List<TarifasDTO> toDto(){
        List<Tarifas> tarifas = tarifasRepository.findAll();
        List<TarifasDTO> tarifasDTO = new ArrayList<>();
        for (Tarifas tarifa : tarifas) {
            TarifasDTO dto = new TarifasDTO(tarifa.getId(),tarifa.getNombre(), tarifa.getVueltas(),tarifa.getTiempo(),tarifa.getPreciosRegulares(),tarifa.getDuracionTotal());
            tarifasDTO.add(dto);
        }
        return tarifasDTO;
    }
    //crud basico
    public List<TarifasDTO> findAll(){
        return toDto();
    }
    public Tarifas findById(Long id){
        return tarifasRepository.findById(id).get();
    }
    public  Tarifas save(Tarifas tarifas){
        return tarifasRepository.save(tarifas);
    }
    public Tarifas updateTarifa(Long id, Tarifas tarifaDetails) {
        Tarifas tarifa = tarifasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarifa no encontrada con id: " + id));
        tarifa.setNombre(tarifaDetails.getNombre());
        tarifa.setTiempo(tarifaDetails.getTiempo());
        tarifa.setDuracionTotal(tarifaDetails.getDuracionTotal());
        tarifa.setVueltas(tarifaDetails.getVueltas());
        tarifa.setId(tarifa.getId());
        tarifa.setPreciosRegulares(tarifaDetails.getPreciosRegulares());
        return tarifasRepository.save(tarifa);
    }
    public void deleteById(Long id){
        tarifasRepository.deleteById(id);
    }

    //tarifa especial fin de semana
    public void tarifasFinDeSemana(Double mult){
        List<Tarifas> tarifas = tarifasRepository.findAll();
        for (Tarifas tarifasAux : tarifas) {
            tarifasAux.setPreciosRegulares(tarifasAux.getPreciosRegulares()*mult);//segun el multi se modificara
            tarifasAux.setNombre("GENERAL FIN DE SEMANA");
            tarifasAux.setVueltas(tarifasAux.getVueltas());
            tarifasAux.setTiempo(tarifasAux.getTiempo());
            tarifasRepository.save(tarifasAux);
        }
    }
    //INICIALIZAR TARIFAS BASICAS, ELIMINAR TODO LO ANTERIOR(Sirve para reiniciar tarifas basicas)
    public void inicializarTarifasBasicas(){
        tarifasRepository.deleteAll();//eliminamos tarifas existentes

        Tarifas tarifas = new Tarifas("GENERAL","10 vueltas","10 min",15000.0,"30 MIN");
        Tarifas tarifas1= new Tarifas("GENERAL","15 vueltas","15 min", 20000.0, "35 MIN");
        Tarifas tarifas2= new Tarifas("GENERAL","20 vueltas","20 min", 25000.0, "40 MIN");

        tarifasRepository.save(tarifas);
        tarifasRepository.save(tarifas1);
        tarifasRepository.save(tarifas2);
    }
}
