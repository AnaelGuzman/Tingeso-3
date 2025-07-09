package com.karting_ev_3.karting_rm.controllers;

import com.karting_ev_3.karting_rm.dto.UsuarioDTO;
import com.karting_ev_3.karting_rm.entities.Usuarios;
import com.karting_ev_3.karting_rm.services.UsuariosServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
@CrossOrigin("*")
public class UsuariosController {
    @Autowired
    UsuariosServices usuariosServices;

    @GetMapping
    public List<UsuarioDTO> findAll(){
        return usuariosServices.findAll();
    }
    @GetMapping("/id/{id}")
    public Usuarios findById(@PathVariable Long id){
        return usuariosServices.findById(id);
    }
    @GetMapping("/rut/{rut}")
    public UsuarioDTO findByRut(@PathVariable String rut){
        return usuariosServices.findByRut(rut);
    }
    @PostMapping
    public UsuarioDTO save(@RequestBody Usuarios usuarios){
        return usuariosServices.save(usuarios);
    }
    @PutMapping("/{id}")
    public UsuarioDTO update(@PathVariable Long id, @RequestBody Usuarios user){
        return usuariosServices.update(id,user);
    }
    @DeleteMapping("/id/{id}")
    public void delete(@PathVariable Long id){
        usuariosServices.delete(id);
    }

    @PutMapping("/reiniciar-visitas")
    public void reiniciarVisitas() {
        usuariosServices.reiniciarVisitas();
    }

    @PostMapping("/inicializar")
    public void inicializar(){
        usuariosServices.inicializarUsuarios();
    }
}
