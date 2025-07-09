package com.karting_ev_3.karting_rm.services;

import com.karting_ev_3.karting_rm.dto.ReservaDTO;
import com.karting_ev_3.karting_rm.entities.Reserva;
import com.karting_ev_3.karting_rm.entities.Tarifas;
import com.karting_ev_3.karting_rm.entities.TarifasEspeciales;
import com.karting_ev_3.karting_rm.entities.Usuarios;
import com.karting_ev_3.karting_rm.repositories.ReservaRepository;
import com.karting_ev_3.karting_rm.repositories.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReservaServices {
    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private UsuariosServices usuariosServices;
    @Autowired
    private UsuariosRepository usuariosRepository;

    public List<ReservaDTO> toDTO(){
        List<ReservaDTO> dto = new ArrayList<>();
        List<Reserva> reservas = reservaRepository.findAll();
        for (Reserva reserva : reservas) {
            ReservaDTO reservaDTO = new ReservaDTO(reserva.getId(),reserva.getFechaReserva(),reserva.getHoraInicioReserva(),reserva.getHoraFinReserva(),
                    reserva.getTarifaEscogida(),reserva.getPrecioNeto(),reserva.getPrecioIva(),reserva.getValorFinal());
            dto.add(reservaDTO);
        }
        return dto;
    }

    public List<ReservaDTO> getReservas() {
        return toDTO();
    }
    public Reserva findReserva(Long id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva con ID " + id + " no encontrada."));
    }
    public Reserva reserva(Reserva reserva) {
        if (reserva.getId() != null && reservaRepository.existsById(reserva.getId())) {
            throw new IllegalArgumentException("La reserva ya existe con ID " + reserva.getId());
        }
        return reservaRepository.save(reserva);
    }
    public Reserva updateReserva(Long idReserva ,Reserva reserva) {
        if (reserva.getId() == null || !reservaRepository.existsById(reserva.getId())) {
            throw new IllegalArgumentException("No se puede actualizar: la reserva no existe.");
        }
        Reserva reserva1 = findReserva(idReserva);
        reserva1.setFechaReserva(reserva.getFechaReserva());
        reserva1.setHoraInicioReserva(reserva.getHoraInicioReserva());
        reserva1.setHoraFinReserva(reserva.getHoraFinReserva());
        reserva1.setTarifaEscogida(reserva.getTarifaEscogida());
        reserva1.setVueltas(reserva.getVueltas());
        reserva1.setTiempo(reserva.getTiempo());
        reserva1.setValorTarifaEscogida(reserva.getValorFinal());
        reserva1.setPrecioNeto(reserva.getPrecioNeto());
        reserva1.setPrecioIva(reserva.getPrecioIva());
        reserva1.setValorFinal(reserva.getValorFinal());

        return reservaRepository.save(reserva);
    }
    public void deleteReserva(Reserva reserva) {
        if (reserva.getId() == null || !reservaRepository.existsById(reserva.getId())) {
            throw new IllegalArgumentException("La reserva que intentas eliminar no existe.");
        }
        reservaRepository.delete(reserva);
    }
    public void deleteReserva(Long id) {
        if (!reservaRepository.existsById(id)) {
            throw new IllegalArgumentException("No se puede eliminar: reserva con ID " + id + " no encontrada.");
        }
        reservaRepository.deleteById(id);
    }

    //Asignar Tarifa general o Especial

    //caso reserva esccogida es normal
    public void asignarTarifaGeneral(Long idReserva, Tarifas tarifaGeneral) {
        Reserva reserva = findReserva(idReserva);

        reserva.setTarifaEscogida(tarifaGeneral.getNombre());
        reserva.setValorFinal(tarifaGeneral.getPreciosRegulares());
        reserva.setTiempo(tarifaGeneral.getTiempo());
        reserva.setVueltas(tarifaGeneral.getVueltas());
        reservaRepository.save(reserva);
    }
    //caso reserva escogida es especial
    public void asignarTarifaEspeciales(Long idReserva, TarifasEspeciales tarifaGeneral) {
        Reserva reserva = findReserva(idReserva);

        reserva.setTarifaEscogida(tarifaGeneral.getNombre());
        reserva.setValorFinal(tarifaGeneral.getPreciosRegulares());
        reserva.setTiempo(tarifaGeneral.getTiempo());
        reserva.setVueltas(tarifaGeneral.getVueltas());
        reservaRepository.save(reserva);
    }

    //apartado para agregar usuarios
    public void agregarParticipante(Long idReserva,Long idUsuario){
        if(idReserva == null || idUsuario == null){
            throw new IllegalArgumentException("La reservao usuario que intentas agregar no existe.");
        }
        Reserva reserva = findReserva(idReserva);
        Usuarios usuario = usuariosServices.findById(idUsuario);
        usuario.setTarifaFinal(reserva.getValorTarifaEscogida());
        reserva.getUsuarios().add(usuario);
        reservaRepository.save(reserva);
    }
    public void eliminarParticipante(Long idReserva,Long idUsuario){
        if(idReserva == null || idUsuario == null){
            throw new IllegalArgumentException("La reserva o usuario que intentas eliminar no existe.");
        }
        Reserva reserva = findReserva(idReserva);
        List<Usuarios> usuarios = reserva.getUsuarios();
        for(Usuarios usuario : usuarios){
            if(usuario.getId().equals(idUsuario)){
                usuarios.remove(usuario);
            }
        }
        reservaRepository.save(reserva);
    }

    //aux para que los usuarios se le aplique el descuento escogido
    public void aplicarDescuentosToUsuarios(Reserva reserva){
        for(Usuarios usuario : reserva.getUsuarios()){
            usuario.setTarifaFinal(usuario.getTarifaFinal() - usuario.getTarifaFinal()*usuario.getPorcentajeDescuento());
        }
    }

    public void calcularValoresReserva(Reserva reserva) {
        // Reiniciar valores
        reserva.setPrecioNeto(0.0);
        reserva.setPrecioIva(0.0);
        reserva.setValorFinal(0.0);

        if (reserva.getUsuarios() == null || reserva.getUsuarios().isEmpty()) {
            reservaRepository.save(reserva);
            return;
        }

        Double precioBasePorUsuario = reserva.getValorTarifaEscogida();
        Double totalNeto = 0.0;

        for (Usuarios usuario : reserva.getUsuarios()) {
            usuario.setVisitas(usuario.getVisitas() + 1);
            Double descuento = usuario.getPorcentajeDescuento() != null ? usuario.getPorcentajeDescuento() : 0.0;
            Double precioConDescuento = precioBasePorUsuario * (1 - descuento);
            usuario.setTarifaFinal(precioConDescuento);
            totalNeto += precioConDescuento;

            // Actualizar usuario
            usuariosRepository.save(usuario);
        }

        reserva.setPrecioNeto(totalNeto);
        reserva.setPrecioIva(totalNeto * 0.19);
        reserva.setValorFinal(totalNeto * 1.19);

        reservaRepository.save(reserva);
    }
}
