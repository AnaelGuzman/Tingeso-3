package com.karting_ev_3.karting_rm.controllers;

import com.karting_ev_3.karting_rm.entities.EventRack;
import com.karting_ev_3.karting_rm.services.EventRackServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/eventos-rack")
@CrossOrigin("*")
public class EventRackController {

    private final EventRackServices eventRackServices;

    @Autowired
    public EventRackController(EventRackServices eventRackServices) {
        this.eventRackServices = eventRackServices;
    }

    @GetMapping
    public ResponseEntity<List<EventRack>> getAllEvents() {
        return ResponseEntity.ok(eventRackServices.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventRack> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventRackServices.getEventById(id));
    }

    @PostMapping
    public ResponseEntity<EventRack> createEvent(@RequestBody EventRack event) {
        return ResponseEntity.ok(eventRackServices.createEvent(event));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventRack> updateEvent(@PathVariable Long id, @RequestBody EventRack eventDetails) {
        return ResponseEntity.ok(eventRackServices.updateEvent(id, eventDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventRackServices.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/from-reserva/{idReserva}")
    public ResponseEntity<EventRack> crearEventoFromReserva(@PathVariable Long idReserva) {
        return ResponseEntity.ok(eventRackServices.crearEventoFromReserva(idReserva));
    }

    @GetMapping("/check-availability")
    public ResponseEntity<Boolean> checkEventAvailability(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam @DateTimeFormat(pattern = "HH:mm") LocalTime horaInicio,
            @RequestParam @DateTimeFormat(pattern = "HH:mm") LocalTime horaFin,
            @RequestParam(required = false) Long excludeId) {

        return ResponseEntity.ok(
                eventRackServices.checkEventAvailability(fecha, horaInicio, horaFin, excludeId)
        );
    }
}
