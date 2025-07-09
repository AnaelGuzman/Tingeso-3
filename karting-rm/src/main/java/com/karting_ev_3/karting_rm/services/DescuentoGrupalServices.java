package com.karting_ev_3.karting_rm.services;

import com.karting_ev_3.karting_rm.entities.DescuentoGrupal;
import com.karting_ev_3.karting_rm.entities.Usuarios;
import com.karting_ev_3.karting_rm.repositories.DescuentoGrupalRepository;
import com.karting_ev_3.karting_rm.repositories.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DescuentoGrupalServices {
    @Autowired
    DescuentoGrupalRepository descuentoGrupalRepository;
    @Autowired
    UsuariosServices usuariosServices;

    public DescuentoGrupal getDescuentoGrupalById(Long id) {
        return descuentoGrupalRepository.findById(id).get();
    }

    public List<DescuentoGrupal> getAllDescuentoGrupal() {
        return descuentoGrupalRepository.findAll();
    }
    public void deleteDescuentoGrupalById(Long id) {
        descuentoGrupalRepository.deleteById(id);
    }
    public void delete(DescuentoGrupal descuentoGrupal) {
        descuentoGrupalRepository.delete(descuentoGrupal);
    }

    public DescuentoGrupal asignarDescuentoGrupal(Usuarios user, Integer tamanioGrupo) {
        DescuentoGrupal descuento;
        if(15 > tamanioGrupo && tamanioGrupo > 10){
            descuento = new DescuentoGrupal("DESCUENTO GRUPAL",11,15,0.30);
        } else if (tamanioGrupo > 5) {
            descuento = new DescuentoGrupal("DESCUENTO GRUPAL",6,10,0.20);
        } else if (tamanioGrupo > 2) {
            descuento = new DescuentoGrupal("DESCUENTO GRUPAL",3,5,0.10);
        } else {
            descuento = new DescuentoGrupal("SIN DESCUENTO ",1,2,0.0);
        }

        user.setNombreDescuento(descuento.getNombre());
        user.setPorcentajeDescuento(descuento.getDescuento());

        // Guardar usuario
        usuariosServices.update(user.getId(),user);
        return descuentoGrupalRepository.save(descuento);
    }
}
