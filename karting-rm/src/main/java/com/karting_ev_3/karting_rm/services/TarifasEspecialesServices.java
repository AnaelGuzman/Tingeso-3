package com.karting_ev_3.karting_rm.services;

import com.karting_ev_3.karting_rm.entities.TarifasEspeciales;
import com.karting_ev_3.karting_rm.repositories.TarifasEspecialesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TarifasEspecialesServices {
    @Autowired
    TarifasEspecialesRepository tarifasEspecialesRepository;
    //crud basico
    public List<TarifasEspeciales> findAll(){
        return tarifasEspecialesRepository.findAll();
    }
    public TarifasEspeciales findById(Long id) {
        return tarifasEspecialesRepository.findById(id).get();
    }
    public TarifasEspeciales findByDate(Integer dia ,Integer mes) {
        return  tarifasEspecialesRepository.findByDiaAndMes(dia,mes);
    }
    public TarifasEspeciales save(TarifasEspeciales e){
        return tarifasEspecialesRepository.save(e);
    }
    public TarifasEspeciales updateTarifaEspecial(Long id, TarifasEspeciales tarifaDetails) {
        TarifasEspeciales tarifa = tarifasEspecialesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarifa Especial no encontrada con id: " + id));
        tarifa.setId(tarifaDetails.getId());
        tarifa.setNombre(tarifaDetails.getNombre());
        tarifa.setDia(tarifaDetails.getDia());
        tarifa.setMes(tarifaDetails.getMes());
        tarifa.setTiempo(tarifaDetails.getTiempo());
        tarifa.setVueltas(tarifaDetails.getVueltas());
        tarifa.setId(tarifa.getId());
        tarifa.setDuracion(tarifaDetails.getDuracion());
        tarifa.setPreciosRegulares(tarifaDetails.getPreciosRegulares());
        return tarifasEspecialesRepository.save(tarifa);
    }
    public void deleteById(Long id) {
        tarifasEspecialesRepository.deleteById(id);
    }
    public void delete(TarifasEspeciales e){
        tarifasEspecialesRepository.delete(e);
    }
    public void inicializarTarifasEspeciales(){

        tarifasEspecialesRepository.deleteAll();//eliminamos tarifas existentes

        TarifasEspeciales tarifas = new TarifasEspeciales("ESPECIAL NAVIDAD",25,12,"15 vueltas","15 min","30 MIN",12000.0);
        TarifasEspeciales tarifas1= new TarifasEspeciales("ESPECIAL AÑO NUEVO",31,12,"15 vueltas","15 min", "30 MIN", 12000.0);
        TarifasEspeciales tarifas2= new TarifasEspeciales("ESPECIAL HALLOWEEN",31,10,"15 vueltas","15 min", "30 MIN", 12000.0);

        tarifasEspecialesRepository.save(tarifas);
        tarifasEspecialesRepository.save(tarifas1);
        tarifasEspecialesRepository.save(tarifas2);
    }
}
