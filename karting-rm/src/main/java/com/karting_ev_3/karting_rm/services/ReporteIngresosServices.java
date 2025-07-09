package com.karting_ev_3.karting_rm.services;

import com.karting_ev_3.karting_rm.dto.ReporteCompletoDTO;
import com.karting_ev_3.karting_rm.dto.ReporteIngresosDTO;
import com.karting_ev_3.karting_rm.entities.ReporteIngresos;
import com.karting_ev_3.karting_rm.entities.Reserva;
import com.karting_ev_3.karting_rm.repositories.ReporteIngresosRepository;
import com.karting_ev_3.karting_rm.repositories.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReporteIngresosServices {

    @Autowired
    private ReporteIngresosRepository reporteRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    // Generar reporte por número de vueltas o tiempo máximo
    public ReporteCompletoDTO generarReportePorVueltasTiempo(LocalDate fechaInicio, LocalDate fechaFin) {
        List<Reserva> reservas = reservaRepository.findByFechaReservaBetween(fechaInicio, fechaFin);

        // Agrupar reservas por vueltas
        Map<String, List<Reserva>> reservasPorVueltas = reservas.stream()
                .collect(Collectors.groupingBy(Reserva::getVueltas));

        List<ReporteIngresosDTO> detalles = new ArrayList<>();
        Double ingresoTotalPeriodo = 0.0;
        Integer totalReservas = 0;

        // Procesar cada categoría de vueltas
        for (Map.Entry<String, List<Reserva>> entry : reservasPorVueltas.entrySet()) {
            String categoria = entry.getKey();
            List<Reserva> reservasCategoria = entry.getValue();

            ReporteIngresosDTO detalle = calcularIngresosCategoria(categoria, reservasCategoria);
            detalles.add(detalle);

            ingresoTotalPeriodo += detalle.getIngresoTotal();
            totalReservas += detalle.getCantidadReservas();

            // Guardar en base de datos
            guardarReporteEnBD("VUELTAS_TIEMPO", categoria, detalle, fechaInicio, fechaFin);
        }

        // Calcular porcentajes
        calcularPorcentajes(detalles, ingresoTotalPeriodo);

        return new ReporteCompletoDTO(
                "VUELTAS_TIEMPO",
                fechaInicio,
                fechaFin,
                LocalDate.now(),
                ingresoTotalPeriodo,
                totalReservas,
                detalles
        );
    }

    // Generar reporte por número de personas
    public ReporteCompletoDTO generarReportePorNumeroPersonas(LocalDate fechaInicio, LocalDate fechaFin) {
        List<Reserva> reservas = reservaRepository.findByFechaReservaBetween(fechaInicio, fechaFin);

        // Agrupar reservas por número de personas
        Map<String, List<Reserva>> reservasPorPersonas = reservas.stream()
                .collect(Collectors.groupingBy(this::categorizarPorPersonas));

        List<ReporteIngresosDTO> detalles = new ArrayList<>();
        Double ingresoTotalPeriodo = 0.0;
        Integer totalReservas = 0;

        // Procesar cada categoría de personas
        for (Map.Entry<String, List<Reserva>> entry : reservasPorPersonas.entrySet()) {
            String categoria = entry.getKey();
            List<Reserva> reservasCategoria = entry.getValue();

            ReporteIngresosDTO detalle = calcularIngresosCategoria(categoria, reservasCategoria);
            detalles.add(detalle);

            ingresoTotalPeriodo += detalle.getIngresoTotal();
            totalReservas += detalle.getCantidadReservas();

            // Guardar en base de datos
            guardarReporteEnBD("NUMERO_PERSONAS", categoria, detalle, fechaInicio, fechaFin);
        }

        // Calcular porcentajes
        calcularPorcentajes(detalles, ingresoTotalPeriodo);

        return new ReporteCompletoDTO(
                "NUMERO_PERSONAS",
                fechaInicio,
                fechaFin,
                LocalDate.now(),
                ingresoTotalPeriodo,
                totalReservas,
                detalles
        );
    }

    // Método auxiliar para categorizar por número de personas
    private String categorizarPorPersonas(Reserva reserva) {
        int numPersonas = reserva.getUsuarios() != null ? reserva.getUsuarios().size() : 0;

        if (numPersonas <= 2) {
            return "1-2 personas";
        } else if (numPersonas <= 5) {
            return "3-5 personas";
        } else if (numPersonas <= 10) {
            return "6-10 personas";
        } else {
            return "11-15 personas";
        }
    }

    // Calcular ingresos para una categoría específica
    private ReporteIngresosDTO calcularIngresosCategoria(String categoria, List<Reserva> reservas) {
        Integer cantidadReservas = reservas.size();
        Double ingresoBruto = reservas.stream()
                .mapToDouble(r -> r.getPrecioNeto() != null ? r.getPrecioNeto() : 0.0)
                .sum();
        Double ingresoNeto = reservas.stream()
                .mapToDouble(r -> r.getPrecioNeto() != null ? r.getPrecioNeto() : 0.0)
                .sum();
        Double ingresoIva = reservas.stream()
                .mapToDouble(r -> r.getPrecioIva() != null ? r.getPrecioIva() : 0.0)
                .sum();
        Double ingresoTotal = reservas.stream()
                .mapToDouble(r -> r.getValorFinal() != null ? r.getValorFinal() : 0.0)
                .sum();

        return new ReporteIngresosDTO(
                categoria,
                cantidadReservas,
                ingresoBruto,
                ingresoNeto,
                ingresoIva,
                ingresoTotal,
                0.0 // Se calculará después
        );
    }

    // Calcular porcentajes del total
    private void calcularPorcentajes(List<ReporteIngresosDTO> detalles, Double ingresoTotalPeriodo) {
        for (ReporteIngresosDTO detalle : detalles) {
            if (ingresoTotalPeriodo > 0) {
                Double porcentaje = (detalle.getIngresoTotal() / ingresoTotalPeriodo) * 100;
                detalle.setPorcentajeDelTotal(Math.round(porcentaje * 100.0) / 100.0);
            }
        }
    }

    // Guardar reporte en base de datos
    private void guardarReporteEnBD(String tipoReporte, String categoria, ReporteIngresosDTO detalle,
                                    LocalDate fechaInicio, LocalDate fechaFin) {
        ReporteIngresos reporte = new ReporteIngresos();
        reporte.setTipoReporte(tipoReporte);
        reporte.setCategoria(categoria);
        reporte.setFechaInicio(fechaInicio);
        reporte.setFechaFin(fechaFin);
        reporte.setCantidadReservas(detalle.getCantidadReservas());
        reporte.setIngresoBruto(detalle.getIngresoBruto());
        reporte.setIngresoNeto(detalle.getIngresoNeto());
        reporte.setIngresoIva(detalle.getIngresoIva());
        reporte.setIngresoTotal(detalle.getIngresoTotal());
        reporte.setFechaGeneracion(LocalDate.now());

        reporteRepository.save(reporte);
    }

    // Obtener reportes históricos
    public List<ReporteIngresos> obtenerReportesHistoricos(String tipoReporte, LocalDate fechaInicio, LocalDate fechaFin) {
        return reporteRepository.findByTipoReporteAndFechaInicioAndFechaFin(tipoReporte, fechaInicio, fechaFin);
    }

    // Obtener todos los reportes
    public List<ReporteIngresos> obtenerTodosLosReportes() {
        return reporteRepository.findAll();
    }

    // Obtener estadísticas agregadas
    public List<Object[]> obtenerEstadisticasAgregadas(String tipoReporte, LocalDate fechaInicio, LocalDate fechaFin) {
        return reporteRepository.getEstadisticasAgregadas(tipoReporte, fechaInicio, fechaFin);
    }

    // Eliminar reporte
    public void eliminarReporte(Long id) {
        if (!reporteRepository.existsById(id)) {
            throw new IllegalArgumentException("Reporte con ID " + id + " no encontrado.");
        }
        reporteRepository.deleteById(id);
    }
}
