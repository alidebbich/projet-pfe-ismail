package com.uib.pulse.service;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;

@Service
public class ReportService {

    public byte[] generatePdfReport(String type, LocalDate from, LocalDate to) throws Exception {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();
            
            document.add(new Paragraph("Rapport UIB Pulse - " + type.toUpperCase()));
            document.add(new Paragraph("Periode: " + from + " au " + to));
            document.add(new Paragraph(""));
            document.add(new Paragraph("Ceci est un rapport genere automatiquement."));
            
            document.close();
            return out.toByteArray();
        }
    }

    public byte[] generateExcelReport(String type, LocalDate from, LocalDate to) throws Exception {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(type + " Report");
            
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Type de Rapport");
            headerRow.createCell(1).setCellValue("Date de debut");
            headerRow.createCell(2).setCellValue("Date de fin");
            
            Row dataRow = sheet.createRow(1);
            dataRow.createCell(0).setCellValue(type.toUpperCase());
            dataRow.createCell(1).setCellValue(from.toString());
            dataRow.createCell(2).setCellValue(to.toString());
            
            workbook.write(out);
            return out.toByteArray();
        }
    }
}
