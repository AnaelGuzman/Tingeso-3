package com.karting_ev_3.karting_rm.services;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.karting_ev_3.karting_rm.entities.Reserva;
import com.karting_ev_3.karting_rm.entities.Usuarios;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
public class GeneradorVoucherServices {

    public byte[] generarComprobantePdf(Reserva reserva) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Fuentes
        PdfFont fontBold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont fontNormal = PdfFontFactory.createFont(StandardFonts.HELVETICA);

        // Título del comprobante
        Paragraph title = new Paragraph("COMPROBANTE DE PAGO - KARTINGRM")
                .setFont(fontBold)
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(title);

        // Información de la reserva
        Paragraph infoTitle = new Paragraph("Información de la Reserva:")
                .setFont(fontBold)
                .setFontSize(12)
                .setMarginBottom(5);
        document.add(infoTitle);

        // Tabla de información de reserva
        float[] columnWidths = {150, 300};
        Table infoTable = new Table(UnitValue.createPercentArray(columnWidths));

        addInfoRow(infoTable, "Código de reserva:", reserva.getId().toString(), fontNormal);
        addInfoRow(infoTable, "Fecha y hora:",
                reserva.getFechaReserva().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + " " +
                        reserva.getHoraInicioReserva().format(DateTimeFormatter.ofPattern("HH:mm")), fontNormal);
        addInfoRow(infoTable, "Número de vueltas/tiempo:",
                reserva.getVueltas() + " / " + reserva.getTiempo(), fontNormal);
        addInfoRow(infoTable, "Cantidad de personas:",
                String.valueOf(reserva.getUsuarios().size()), fontNormal);
        addInfoRow(infoTable, "Nombre del responsable:",
                reserva.getUsuarios().get(0).getNombre() + " " + reserva.getUsuarios().get(0).getApellido(), fontNormal);

        document.add(infoTable);
        document.add(new Paragraph("\n"));

        // Detalle de pago
        Paragraph paymentTitle = new Paragraph("Detalle de Pago:")
                .setFont(fontBold)
                .setFontSize(12)
                .setMarginBottom(5);
        document.add(paymentTitle);

        // Tabla de detalle de pago - Ajustamos los anchos de columna
        float[] paymentColumnWidths = {120, 80, 100, 80, 80, 60, 80};
        Table paymentTable = new Table(UnitValue.createPercentArray(paymentColumnWidths));
        paymentTable.setWidth(UnitValue.createPercentValue(100)); // Ocupa todo el ancho disponible

        // Encabezados de la tabla
        addPaymentHeaderCell(paymentTable, "Nombre", fontBold);
        addPaymentHeaderCell(paymentTable, "Tarifa Base", fontBold);
        addPaymentHeaderCell(paymentTable, "Nombre Descuento", fontBold);
        addPaymentHeaderCell(paymentTable, "% Desc", fontBold);
        addPaymentHeaderCell(paymentTable, "Valor Desc", fontBold);
        addPaymentHeaderCell(paymentTable, "IVA", fontBold);
        addPaymentHeaderCell(paymentTable, "Total", fontBold);

        // Filas con datos de cada usuario
        for (Usuarios usuario : reserva.getUsuarios()) {
            Double porcentajeDesc = usuario.getPorcentajeDescuento() != null ? usuario.getPorcentajeDescuento() : 0.0;
            Double valorDesc = reserva.getValorTarifaEscogida() * porcentajeDesc;
            Double iva = reserva.getValorTarifaEscogida() * 0.19;
            Double total = usuario.getTarifaFinal() * 1.19;

            // Nombre
            paymentTable.addCell(new Cell().add(new Paragraph(usuario.getNombre() + " " + usuario.getApellido()).setFont(fontNormal)));

            // Tarifa Base
            addPaymentDataCell(paymentTable, formatCurrency(reserva.getValorTarifaEscogida()), fontNormal);

            // Nombre Descuento
            paymentTable.addCell(new Cell().add(new Paragraph(
                    usuario.getNombreDescuento() != null ? usuario.getNombreDescuento() : "SIN DESCUENTO"
            )).setFont(fontNormal).setTextAlignment(TextAlignment.LEFT));

            // % Descuento
            addPaymentDataCell(paymentTable, (int)(porcentajeDesc * 100) + "%", fontNormal);

            // Valor Descuento
            addPaymentDataCell(paymentTable, formatCurrency(valorDesc), fontNormal);

            // IVA
            int cant = reserva.getUsuarios().size();
            addPaymentDataCell(paymentTable, formatCurrency(reserva.getPrecioIva()/cant), fontNormal);

            // Total
            addPaymentDataCell(paymentTable, formatCurrency(total), fontNormal);
        }

        // Total general - Ajustamos el colspan para que coincida con el número de columnas
        paymentTable.addCell(new Cell(1, 6).add(new Paragraph("TOTAL GENERAL").setFont(fontBold).setTextAlignment(TextAlignment.RIGHT)));
        addPaymentDataCell(paymentTable, formatCurrency(reserva.getValorFinal()), fontBold);

        document.add(paymentTable);
        document.close();
        return outputStream.toByteArray();
    }

    private void addInfoRow(Table table, String label, String value, PdfFont font) {
        table.addCell(new Cell().add(new Paragraph(label).setFont(font).setBold()));
        table.addCell(new Cell().add(new Paragraph(value).setFont(font)));
    }

    private void addPaymentHeaderCell(Table table, String text, PdfFont font) {
        table.addCell(new Cell()
                .add(new Paragraph(text).setFont(font))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setTextAlignment(TextAlignment.CENTER));
    }

    private void addPaymentDataCell(Table table, String text, PdfFont font) {
        table.addCell(new Cell()
                .add(new Paragraph(text).setFont(font))
                .setTextAlignment(TextAlignment.RIGHT));
    }

    private String formatCurrency(Double amount) {
        if (amount == null) return "$0";
        return "$" + String.format("%,.0f", amount);
    }
}