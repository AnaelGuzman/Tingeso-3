package com.karting_ev_3.karting_rm.services;

import com.karting_ev_3.karting_rm.entities.EventRack;
import com.karting_ev_3.karting_rm.entities.Reserva;
import com.karting_ev_3.karting_rm.repositories.EventRackRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class EventRackServices {
    private final EventRackRepository eventRackRepository;
    private final ReservaServices reservaServices;

    @Autowired
    public EventRackServices(EventRackRepository eventRackRepository,
                             ReservaServices reservaServices) {
        this.eventRackRepository = eventRackRepository;
        this.reservaServices = reservaServices;
    }

    public List<EventRack> getAllEvents() {
        return eventRackRepository.findAll();
    }

    public EventRack getEventById(Long id) {
        return eventRackRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado con ID: " + id));
    }

    public EventRack createEvent(EventRack event) {
        // Verificar solapamiento de horarios
        List<EventRack> overlappingEvents = eventRackRepository.findOverlappingEvents(
                event.getFechaEvento(),
                event.getHoraInicio(),
                event.getHoraFin()
        );

        if (!overlappingEvents.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un evento en el mismo horario"
            );
        }

        // Verificar si ya existe un evento para esta reserva (si aplica)
        if (event.getIdReserva() != null) {
            if (eventRackRepository.existsByIdReserva(event.getIdReserva())) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Ya existe un evento para esta reserva"
                );
            }
        }

        return eventRackRepository.save(event);
    }

    public EventRack updateEvent(Long id, EventRack eventDetails) {
        EventRack existingEvent = getEventById(id);

        // Verificar solapamiento de horarios excluyendo el evento actual
        List<EventRack> overlappingEvents = eventRackRepository.findOverlappingEventsExcludingId(
                eventDetails.getFechaEvento(),
                eventDetails.getHoraInicio(),
                eventDetails.getHoraFin(),
                id
        );

        if (!overlappingEvents.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe otro evento en el mismo horario"
            );
        }

        // Verificar si ya existe un evento para esta reserva (si aplica y ha cambiado)
        if (eventDetails.getIdReserva() != null &&
                !eventDetails.getIdReserva().equals(existingEvent.getIdReserva())) {
            if (eventRackRepository.existsByIdReserva(eventDetails.getIdReserva())) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Ya existe un evento para esta reserva"
                );
            }
        }

        existingEvent.setFechaEvento(eventDetails.getFechaEvento());
        existingEvent.setHoraInicio(eventDetails.getHoraInicio());
        existingEvent.setHoraFin(eventDetails.getHoraFin());
        existingEvent.setIdReserva(eventDetails.getIdReserva());
        existingEvent.setMensaje(eventDetails.getMensaje());

        return eventRackRepository.save(existingEvent);
    }

    public void deleteEvent(Long id) {
        if (!eventRackRepository.existsById(id)) {
            throw new EntityNotFoundException("No se puede eliminar: Evento con ID " + id + " no existe");
        }
        eventRackRepository.deleteById(id);
    }

    public EventRack crearEventoFromReserva(Long idReserva) {
        // Verificar si ya existe un evento para esta reserva
        if (eventRackRepository.existsByIdReserva(idReserva)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un evento para esta reserva"
            );
        }

        Reserva reserva = reservaServices.findReserva(idReserva);

        // Verificar solapamiento de horarios
        List<EventRack> overlappingEvents = eventRackRepository.findOverlappingEvents(
                reserva.getFechaReserva(),
                reserva.getHoraInicioReserva(),
                reserva.getHoraFinReserva()
        );

        if (!overlappingEvents.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un evento en el mismo horario"
            );
        }

        EventRack evento = new EventRack();
        evento.setFechaEvento(reserva.getFechaReserva());
        evento.setHoraInicio(reserva.getHoraInicioReserva());
        evento.setHoraFin(reserva.getHoraFinReserva());
        evento.setIdReserva(reserva.getId());
        evento.setMensaje("Reserva Asignada - " + reserva.getUsuarios().get(0).getNombre());

        return eventRackRepository.save(evento);
    }

    // Nuevo endpoint para verificar disponibilidad
    public boolean checkEventAvailability(LocalDate fecha, LocalTime horaInicio, LocalTime horaFin, Long excludeId) {
        List<EventRack> overlappingEvents;

        if (excludeId != null) {
            overlappingEvents = eventRackRepository.findOverlappingEventsExcludingId(
                    fecha, horaInicio, horaFin, excludeId
            );
        } else {
            overlappingEvents = eventRackRepository.findOverlappingEvents(
                    fecha, horaInicio, horaFin
            );
        }

        return overlappingEvents.isEmpty();
    }
}
