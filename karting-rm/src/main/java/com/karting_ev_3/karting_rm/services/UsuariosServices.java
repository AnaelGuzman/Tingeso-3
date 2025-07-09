package com.karting_ev_3.karting_rm.services;

import com.karting_ev_3.karting_rm.dto.UsuarioDTO;
import com.karting_ev_3.karting_rm.entities.Usuarios;
import com.karting_ev_3.karting_rm.excepciones.UsuarioNotFoundException;
import com.karting_ev_3.karting_rm.repositories.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class UsuariosServices {
    @Autowired
    private UsuariosRepository usuariosRepository;

    // Método para convertir entidades a DTOs
    public List<UsuarioDTO> toDto(List<Usuarios> lista) {
        return lista.stream()
                .map(usuario -> new UsuarioDTO(
                        usuario.getId(),
                        usuario.getRut(),
                        usuario.getNombre(),
                        usuario.getApellido(),
                        usuario.getEmail(),
                        usuario.getFechaNacimiento(),
                        usuario.getUltimaVisita(),
                        usuario.getVisitas()))
                .collect(Collectors.toList());
    }

    public List<UsuarioDTO> findAll() {
        return toDto(usuariosRepository.findAll());
    }

    public Usuarios findById(Long id) {
        Usuarios usuario = usuariosRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario con ID " + id + " no encontrado"));
        return usuario;
    }

    public UsuarioDTO findByRut(String rut) {
        Usuarios usuario = usuariosRepository.findByRut(rut)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario con RUT " + rut + " no encontrado"));
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getRut(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getFechaNacimiento(),
                usuario.getUltimaVisita(),
                usuario.getVisitas());
    }

    public UsuarioDTO save(Usuarios usuario) {
        // Validar que el RUT no exista
        if (usuariosRepository.existsByRut(usuario.getRut())) {
            throw new IllegalArgumentException("El RUT ya está registrado.");
        }

        Usuarios savedUsuario = usuariosRepository.save(usuario);
        return new UsuarioDTO(
                savedUsuario.getId(),
                savedUsuario.getRut(),
                savedUsuario.getNombre(),
                savedUsuario.getApellido(),
                savedUsuario.getEmail(),
                savedUsuario.getFechaNacimiento(),
                savedUsuario.getUltimaVisita(),
                savedUsuario.getVisitas());
    }

    public UsuarioDTO update(Long id, Usuarios usuarioActualizado) {
        Usuarios usuarioExistente = usuariosRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario con ID " + id + " no encontrado"));

        // Verificar si el RUT ya existe en otro usuario
        if (!usuarioExistente.getRut().equals(usuarioActualizado.getRut()) &&
                usuariosRepository.existsByRut(usuarioActualizado.getRut())) {
            throw new IllegalArgumentException("El RUT ya está registrado en otro usuario.");
        }

        // Actualizar campos
        usuarioExistente.setNombre(usuarioActualizado.getNombre());
        usuarioExistente.setApellido(usuarioActualizado.getApellido());
        usuarioExistente.setEmail(usuarioActualizado.getEmail());
        usuarioExistente.setRut(usuarioActualizado.getRut());
        usuarioExistente.setFechaNacimiento(usuarioActualizado.getFechaNacimiento());
        usuarioExistente.setUltimaVisita(usuarioActualizado.getUltimaVisita());
        usuarioExistente.setVisitas(usuarioActualizado.getVisitas());

        // Actualizar campos adicionales si existen
        if (usuarioActualizado.getTarifaFinal() != null) {
            usuarioExistente.setTarifaFinal(usuarioActualizado.getTarifaFinal());
        }
        if (usuarioActualizado.getNombreDescuento() != null) {
            usuarioExistente.setNombreDescuento(usuarioActualizado.getNombreDescuento());
        }
        if (usuarioActualizado.getPorcentajeDescuento() != null) {
            usuarioExistente.setPorcentajeDescuento(usuarioActualizado.getPorcentajeDescuento());
        }

        Usuarios updatedUsuario = usuariosRepository.save(usuarioExistente);
        return new UsuarioDTO(
                updatedUsuario.getId(),
                updatedUsuario.getRut(),
                updatedUsuario.getNombre(),
                updatedUsuario.getApellido(),
                updatedUsuario.getEmail(),
                updatedUsuario.getFechaNacimiento(),
                updatedUsuario.getUltimaVisita(),
                updatedUsuario.getVisitas());
    }

    public void delete(Long id) {
        if (!usuariosRepository.existsById(id)) {
            throw new UsuarioNotFoundException("No se puede eliminar: usuario con ID " + id + " no existe.");
        }
        usuariosRepository.deleteById(id);
    }


    public void reiniciarVisitas(){
        List<Usuarios> lista = usuariosRepository.findAll();
        for (Usuarios usuarios : lista){
            usuarios.setVisitas(0);
            update(usuarios.getId(), usuarios);
        }
    }


    public List<Usuarios> inicializarUsuarios() {
        usuariosRepository.deleteAll();

        List<Usuarios> usuarios = new ArrayList<>();

        usuarios.add(new Usuarios(
                "12345678-9",
                "Carlos",
                "Gómez",
                "carlos.gomez@example.com",
                LocalDate.of(1990, 5, 12),
                LocalDate.now(),
                0
        ));

        usuarios.add(new Usuarios(
                "98765432-1",
                "María",
                "Fernández",
                "maria.fernandez@example.com",
                LocalDate.of(1985, 9, 3),
                LocalDate.now().minusDays(10),
                0
        ));

        usuarios.add(new Usuarios(
                "11223344-5",
                "Javier",
                "Torres",
                "javier.torres@example.com",
                LocalDate.of(2000, 1, 21),
                LocalDate.now().minusMonths(2),
                0
        ));

        usuariosRepository.saveAll(usuarios);

        return usuarios;
    }
}

