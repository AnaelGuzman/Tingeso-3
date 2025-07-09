package com.karting_ev_3.karting_rm.controllers;

import com.karting_ev_3.karting_rm.dto.ReservaDTO;
import com.karting_ev_3.karting_rm.entities.Reserva;
import com.karting_ev_3.karting_rm.entities.Tarifas;
import com.karting_ev_3.karting_rm.entities.TarifasEspeciales;
import com.karting_ev_3.karting_rm.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;
@RestController
@RequestMapping("/reservas")
@CrossOrigin("*")
public class ReservaController {
    @Autowired
    private ReservaServices reservaService;
    @Autowired
    private TarifasServices tarifasServices;
    @Autowired
    private TarifasEspecialesServices tarifasEspecialesServices;
    @Autowired
    private UsuariosServices usuariosServices;
    @Autowired
    private GeneradorVoucherServices generadorVoucherServices;

    @GetMapping
    public List<ReservaDTO> getAllReservas() {
        return reservaService.getReservas();
    }

    @GetMapping("/{id}")
    public Reserva getReservaById(@PathVariable Long id) {
        return reservaService.findReserva(id);
    }

    @PostMapping
    public ResponseEntity<Reserva> crearReserva(@RequestBody Reserva reserva) {
        Reserva nueva = reservaService.reserva(reserva);
        return new ResponseEntity<>(nueva, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public Reserva actualizarReserva(@RequestBody Reserva reserva, @PathVariable Long id) {
        return reservaService.updateReserva(id, reserva);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarReservaPorId(@PathVariable Long id) {
        reservaService.deleteReserva(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> eliminarReservaPorObjeto(@RequestBody Reserva reserva) {
        reservaService.deleteReserva(reserva);
        return ResponseEntity.noContent().build();
    }

    // Endpoints para asignar tarifas
    @PostMapping("/{idReserva}/tarifa-general/{idTarifa}")
    public ResponseEntity<Reserva> asignarTarifaGeneral(
            @PathVariable Long idReserva,
            @PathVariable Long idTarifa) {
        Tarifas tarifa = tarifasServices.findById(idTarifa);
        reservaService.asignarTarifaGeneral(idReserva, tarifa);
        return ResponseEntity.ok(reservaService.findReserva(idReserva));
    }

    @PostMapping("/{idReserva}/tarifa-especial/{idTarifaEspecial}")
    public ResponseEntity<Reserva> asignarTarifaEspecial(
            @PathVariable Long idReserva,
            @PathVariable Long idTarifaEspecial) {
        TarifasEspeciales tarifa = tarifasEspecialesServices.findById(idTarifaEspecial);
        reservaService.asignarTarifaEspeciales(idReserva, tarifa);
        return ResponseEntity.ok(reservaService.findReserva(idReserva));
    }

    // Endpoints para gestionar participantes
    @PostMapping("/{idReserva}/participantes/{idUsuario}")
    public ResponseEntity<Reserva> agregarParticipante(
            @PathVariable Long idReserva,
            @PathVariable Long idUsuario) {
        reservaService.agregarParticipante(idReserva, idUsuario);
        return ResponseEntity.ok(reservaService.findReserva(idReserva));
    }

    @DeleteMapping("/{idReserva}/participantes/{idUsuario}")
    public ResponseEntity<Reserva> eliminarParticipante(
            @PathVariable Long idReserva,
            @PathVariable Long idUsuario) {
        reservaService.eliminarParticipante(idReserva, idUsuario);
        return ResponseEntity.ok(reservaService.findReserva(idReserva));
    }

    // Endpoint para calcular valores
    @PostMapping("/{idReserva}/calcular")
    public ResponseEntity<Reserva> calcularValoresReserva(@PathVariable Long idReserva) {
        Reserva reserva = reservaService.findReserva(idReserva);
        reservaService.calcularValoresReserva(reserva);
        return ResponseEntity.ok(reserva);
    }

    //VOUCHER
    @GetMapping("/reservation/{id}/comprobante")
    public ResponseEntity<byte[]> generarComprobante(@PathVariable Long id) throws IOException {
        Reserva reserva = reservaService.findReserva(id);
        byte[] pdfBytes = generadorVoucherServices.generarComprobantePdf(reserva);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "comprobante-reserva-" + id + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

}