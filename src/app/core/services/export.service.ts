// src/app/core/services/export.service.ts
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class ExportService {

  /**
   * Exportar a PDF
   */
  exportToPDF(
    titulo: string,
    columnas: string[],
    datos: any[],
    nombreArchivo: string
  ) {
    const doc = new jsPDF();

    // Logo (opcional)
    // doc.addImage('assets/logo.png', 'PNG', 10, 8, 30, 15);

    doc.setFontSize(16);
    doc.text(titulo, 14, 25);

    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 32);

    autoTable(doc, {
      startY: 40,
      head: [columnas],
      body: datos.map(d => columnas.map(c => d[c] ?? '')),
      styles: { fontSize: 9 }
    });

    doc.save(`${nombreArchivo}.pdf`);
  }

  /**
   * Exportar a Excel
   */
  exportToExcel(
    datos: any[],
    nombreArchivo: string
  ) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Reporte': worksheet },
      SheetNames: ['Reporte']
    };

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob(
      [excelBuffer],
      { type: 'application/octet-stream' }
    );

    saveAs(blob, `${nombreArchivo}.xlsx`);
  }
}
