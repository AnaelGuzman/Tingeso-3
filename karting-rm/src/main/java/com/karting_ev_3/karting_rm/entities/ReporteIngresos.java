package com.karting_ev_3.karting_rm.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reportes_ingresos")
public class ReporteIngresos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "tipo_reporte")
    private String tipoReporte; // "VUELTAS_TIEMPO" o "NUMERO_PERSONAS"

    @Column(name = "categoria")
    private String categoria; // Para vueltas: "10 vueltas", "15 vueltas", "20 vueltas"
    // Para personas: "1-2 personas", "3-5 personas", etc.

    @Column(name = "cantidad_reservas")
    private Integer cantidadReservas;

    @Column(name = "ingreso_bruto")
    private Double ingresoBruto;

    @Column(name = "ingreso_neto")
    private Double ingresoNeto;

    @Column(name = "ingreso_iva")
    private Double ingresoIva;

    @Column(name = "ingreso_total")
    private Double ingresoTotal;

    @Column(name = "fecha_generacion")
    private LocalDate fechaGeneracion;
}
