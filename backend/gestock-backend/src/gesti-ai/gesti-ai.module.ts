
import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { GestiAiController } from './gesti-ai.controller';
import { GestiAiService } from './gesti-ai.service';

@Module({
  imports: [PrismaModule],
  controllers: [GestiAiController],
  providers: [GestiAiService],
  exports: [GestiAiService],
})
export class GestiAiModule {}
