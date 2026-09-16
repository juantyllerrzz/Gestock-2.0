import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  private getProductsForExport() {
    return this.prisma.product.findMany({
      include: { category: true },
      orderBy: { name: 'asc' },
    });
  }

  async generateExcel(): Promise<Buffer> {
    const products = await this.getProductsForExport();
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Gestock';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Inventario');
    sheet.columns = [
      { header: 'SKU', key: 'sku', width: 14 },
      { header: 'Nombre', key: 'name', width: 28 },
      { header: 'Categoría', key: 'category', width: 18 },
      { header: 'Precio unitario', key: 'unitPrice', width: 16 },
      { header: 'Stock actual', key: 'currentStock', width: 14 },
      { header: 'Stock mínimo', key: 'minStock', width: 14 },
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E88D6' } };

    for (const p of products) {
      const row = sheet.addRow({
        sku: p.sku,
        name: p.name,
        category: p.category.name,
        unitPrice: Number(p.unitPrice),
        currentStock: p.currentStock,
        minStock: p.minStock,
      });

      if (p.currentStock <= p.minStock) {
        row.eachCell((cell) => {
          cell.font = { color: { argb: 'FFDC2626' }, bold: true };
        });
      }
    }

    sheet.getColumn('unitPrice').numFmt = '"$"#,##0';

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async generatePdf(): Promise<Buffer> {
    const products = await this.getProductsForExport();

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(18).fillColor('#111111').text('Reporte de Inventario - Gestock');
      doc.fontSize(9).fillColor('#666666').text(`Generado: ${new Date().toLocaleString('es-CO')}`);
      doc.moveDown(1.5);

      const columns = [
        { label: 'SKU', width: 70 },
        { label: 'Nombre', width: 150 },
        { label: 'Categoría', width: 90 },
        { label: 'Precio', width: 70 },
        { label: 'Stock', width: 50 },
        { label: 'Mínimo', width: 55 },
      ];
      const startX = doc.page.margins.left;
      let y = doc.y;

      function drawRow(values: string[], opts: { bold?: boolean; color?: string } = {}) {
        let x = startX;
        doc
          .fontSize(9)
          .fillColor(opts.color ?? '#111111')
          .font(opts.bold ? 'Helvetica-Bold' : 'Helvetica');
        values.forEach((value, i) => {
          doc.text(value, x, y, { width: columns[i].width, ellipsis: true });
          x += columns[i].width;
        });
        y += 20;
      }

      drawRow(columns.map((c) => c.label), { bold: true });
      doc.moveTo(startX, y - 4).lineTo(555, y - 4).strokeColor('#cccccc').stroke();

      for (const p of products) {
        if (y > 760) {
          doc.addPage();
          y = doc.page.margins.top;
        }
        const isLow = p.currentStock <= p.minStock;
        drawRow(
          [
            p.sku,
            p.name,
            p.category.name,
            `$${Number(p.unitPrice).toLocaleString('es-CO')}`,
            String(p.currentStock),
            String(p.minStock),
          ],
          isLow ? { color: '#DC2626', bold: true } : {},
        );
      }

      doc.end();
    });
  }
}