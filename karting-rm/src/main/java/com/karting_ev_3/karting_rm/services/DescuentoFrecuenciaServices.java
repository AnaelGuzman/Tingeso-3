package com.karting_ev_3.karting_rm.services;

import com.karting_ev_3.karting_rm.entities.DescuentoFrecuencia;
import com.karting_ev_3.karting_rm.entities.Reserva;
import com.karting_ev_3.karting_rm.entities.Usuarios;
import com.karting_ev_3.karting_rm.repositories.DescuentoFrecuenciaRepository;
import com.karting_ev_3.karting_rm.repositories.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DescuentoFrecuenciaServices {
    @Autowired
    UsuariosServices usuariosServices;
    @Autowired
    DescuentoFrecuenciaRepository descuentoFrecuenciaRepository;

    public List<DescuentoFrecuencia> findAllDescuentoFrecuencias(){
        return descuentoFrecuenciaRepository.findAll();
    }

    public DescuentoFrecuencia findById(Long id){
        return descuentoFrecuenciaRepository.findById(id).get();
    }

    public void deleteById(Long id){
        descuentoFrecuenciaRepository.deleteById(id);
    }

    public DescuentoFrecuencia asignarDescuentoFrecuencia(Usuarios user, Reserva reserva) {

        DescuentoFrecuencia descuento;
        if(user.getVisitas() > 6) {
            descuento = new DescuentoFrecuencia("DESCUENTO FRECUENCIA", user.getVisitas(), 0.3);
        } else if (user.getVisitas() > 4) {
            descuento = new DescuentoFrecuencia("DESCUENTO FRECUENCIA", user.getVisitas(), 0.2);
        } else if (user.getVisitas() > 1) {
            descuento = new DescuentoFrecuencia("DESCUENTO FRECUENCIA", user.getVisitas(), 0.1);
        } else {
            descuento = new DescuentoFrecuencia("SIN DESCUENTO", user.getVisitas(), 0.0);
        }

        user.setNombreDescuento(descuento.getNombre());
        user.setPorcentajeDescuento(descuento.getDescuento());

        // Guardar ambos: usuario y descuento
        usuariosServices.update(user.getId(),user);
        return descuentoFrecuenciaRepository.save(descuento);
    }
}
