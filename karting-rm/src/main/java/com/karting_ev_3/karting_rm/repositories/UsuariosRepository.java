package com.karting_ev_3.karting_rm.repositories;

import com.karting_ev_3.karting_rm.entities.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuariosRepository extends JpaRepository<Usuarios,Long> {
    Optional<Usuarios> findByRut(String rut);
    boolean existsByRut(String rut);
}
