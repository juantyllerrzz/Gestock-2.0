import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ForecastingService } from './forecasting.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('forecasting')
@UseGuards(JwtAuthGuard)
export class ForecastingController {
  constructor(private forecastingService: ForecastingService) {}

  @Post('product/:productId')
  generateForProduct(@Param('productId') productId: string) {
    return this.forecastingService.generateForProduct(productId);
  }

  @Post('all')
  generateForAll() {
    return this.forecastingService.generateForAll();
  }

  @Get()
  getLatestForecasts() {
    return this.forecastingService.getLatestForecasts();
  }

  @Get('dashboard')
  getDashboardSummary() {
    return this.forecastingService.getDashboardSummary();
  }
}
