package com.karting_ev_3.karting_rm.repositories;

import com.karting_ev_3.karting_rm.entities.ReporteIngresos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReporteIngresosRepository extends JpaRepository<ReporteIngresos, Long> {

    // Buscar reportes por tipo y rango de fechas
    List<ReporteIngresos> findByTipoReporteAndFechaInicioAndFechaFin(
            String tipoReporte, LocalDate fechaInicio, LocalDate fechaFin);

    // Buscar reportes por tipo y fecha de generación
    List<ReporteIngresos> findByTipoReporteAndFechaGeneracion(
            String tipoReporte, LocalDate fechaGeneracion);

    // Buscar reportes por rango de fechas de generación
    List<ReporteIngresos> findByFechaGeneracionBetween(
            LocalDate fechaInicio, LocalDate fechaFin);

    // Query personalizada para obtener el total de ingresos por período
    @Query("SELECT SUM(r.ingresoTotal) FROM ReporteIngresos r " +
            "WHERE r.tipoReporte = :tipoReporte " +
            "AND r.fechaInicio = :fechaInicio " +
            "AND r.fechaFin = :fechaFin")
    Double getTotalIngresosPorPeriodo(@Param("tipoReporte") String tipoReporte,
                                      @Param("fechaInicio") LocalDate fechaInicio,
                                      @Param("fechaFin") LocalDate fechaFin);

    // Query para obtener estadísticas agregadas
    @Query("SELECT r.categoria, SUM(r.cantidadReservas), SUM(r.ingresoTotal) " +
            "FROM ReporteIngresos r " +
            "WHERE r.tipoReporte = :tipoReporte " +
            "AND r.fechaGeneracion BETWEEN :fechaInicio AND :fechaFin " +
            "GROUP BY r.categoria " +
            "ORDER BY SUM(r.ingresoTotal) DESC")
    List<Object[]> getEstadisticasAgregadas(@Param("tipoReporte") String tipoReporte,
                                            @Param("fechaInicio") LocalDate fechaInicio,
                                            @Param("fechaFin") LocalDate fechaFin);
}