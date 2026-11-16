
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { GestiAiService } from './gesti-ai.service';
import { AskGestiAiDto } from './dto/ask-gesti-ai.dto';

@Controller('gesti-ai')
@UseGuards(JwtAuthGuard)
export class GestiAiController {
  constructor(
    private readonly gestiAiService: GestiAiService,
  ) {}

  // POST /gesti-ai/ask
  @Post('ask')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async ask(@Body() dto: AskGestiAiDto) {
    return this.gestiAiService.ask(dto.question);
  }
}
