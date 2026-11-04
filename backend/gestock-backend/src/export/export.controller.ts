import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('export')
@UseGuards(JwtAuthGuard)
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Get('products/excel')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.exportService.generateExcel();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="inventario-gestock.xlsx"',
    });
    res.send(buffer);
  }

  @Get('products/pdf')
  async exportPdf(@Res() res: Response) {
    const buffer = await this.exportService.generatePdf();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="inventario-gestock.pdf"',
    });
    res.send(buffer);
  }
}