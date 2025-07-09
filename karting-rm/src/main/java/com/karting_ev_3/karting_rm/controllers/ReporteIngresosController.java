
package com.karting_ev_3.karting_rm.controllers;

import com.karting_ev_3.karting_rm.dto.ReporteCompletoDTO;
import com.karting_ev_3.karting_rm.dto.ReporteRequestDTO;
import com.karting_ev_3.karting_rm.entities.ReporteIngresos;
import com.karting_ev_3.karting_rm.services.ReporteIngresosServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes") // Cambiado para coincidir con las llamadas del frontend
@CrossOrigin("*")
public class ReporteIngresosController {

    @Autowired
    private ReporteIngresosServices reporteService;

    // Generar reporte por vueltas/tiempo
    @PostMapping("/vueltas-tiempo")
    public ResponseEntity<ReporteCompletoDTO> generarReportePorVueltasTiempo(
            @RequestBody ReporteRequestDTO request) {
        try {
            ReporteCompletoDTO reporte = reporteService.generarReportePorVueltasTiempo(
                    request.getFechaInicio(),
                    request.getFechaFin()
            );
            return ResponseEntity.ok(reporte);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Generar reporte por vueltas/tiempo con parámetros URL
    @GetMapping("/vueltas-tiempo")
    public ResponseEntity<ReporteCompletoDTO> generarReportePorVueltasTiempoGet(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        try {
            ReporteCompletoDTO reporte = reporteService.generarReportePorVueltasTiempo(fechaInicio, fechaFin);
            return ResponseEntity.ok(reporte);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Generar reporte por número de personas
    @PostMapping("/numero-personas")
    public ResponseEntity<ReporteCompletoDTO> generarReportePorNumeroPersonas(
            @RequestBody ReporteRequestDTO request) {
        try {
            ReporteCompletoDTO reporte = reporteService.generarReportePorNumeroPersonas(
                    request.getFechaInicio(),
                    request.getFechaFin()
            );
            return ResponseEntity.ok(reporte);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Generar reporte por número de personas con parámetros URL
    @GetMapping("/numero-personas")
    public ResponseEntity<ReporteCompletoDTO> generarReportePorNumeroPersonasGet(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        try {
            ReporteCompletoDTO reporte = reporteService.generarReportePorNumeroPersonas(fechaInicio, fechaFin);
            return ResponseEntity.ok(reporte);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener todos los reportes históricos
    @GetMapping("/historicos")
    public ResponseEntity<List<ReporteIngresos>> obtenerReportesHistoricos() {
        try {
            List<ReporteIngresos> reportes = reporteService.obtenerTodosLosReportes();
            return ResponseEntity.ok(reportes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener reportes históricos filtrados
    @GetMapping("/historicos/{tipoReporte}")
    public ResponseEntity<List<ReporteIngresos>> obtenerReportesHistoricosFiltrados(
            @PathVariable String tipoReporte,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        try {
            List<ReporteIngresos> reportes = reporteService.obtenerReportesHistoricos(
                    tipoReporte, fechaInicio, fechaFin);
            return ResponseEntity.ok(reportes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener estadísticas agregadas
    @GetMapping("/estadisticas/{tipoReporte}")
    public ResponseEntity<List<Object[]>> obtenerEstadisticasAgregadas(
            @PathVariable String tipoReporte,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        try {
            List<Object[]> estadisticas = reporteService.obtenerEstadisticasAgregadas(
                    tipoReporte, fechaInicio, fechaFin);
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Eliminar reporte específico
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarReporte(@PathVariable Long id) {
        try {
            reporteService.eliminarReporte(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoint para generar ambos tipos de reportes
    @PostMapping("/completo")
    public ResponseEntity<Map<String, ReporteCompletoDTO>> generarReporteCompleto(
            @RequestBody ReporteRequestDTO request) {
        try {
            ReporteCompletoDTO reporteVueltas = reporteService.generarReportePorVueltasTiempo(
                    request.getFechaInicio(), request.getFechaFin());
            ReporteCompletoDTO reportePersonas = reporteService.generarReportePorNumeroPersonas(
                    request.getFechaInicio(), request.getFechaFin());

            Map<String, ReporteCompletoDTO> reporteCompleto = new HashMap<>();
            reporteCompleto.put("vueltasTiempo", reporteVueltas);
            reporteCompleto.put("numeroPersonas", reportePersonas);

            return ResponseEntity.ok(reporteCompleto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}