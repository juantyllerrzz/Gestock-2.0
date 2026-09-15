import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('movements')
@UseGuards(JwtAuthGuard)
export class MovementsController {
  constructor(private movementsService: MovementsService) {}

  @Post()
  create(@Body() dto: CreateMovementDto, @Req() req: any) {
    return this.movementsService.create(dto, req.user.id);
  }

  @Get()
  findAll() {
    return this.movementsService.findAll();
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.movementsService.findByProduct(productId);
  }
}