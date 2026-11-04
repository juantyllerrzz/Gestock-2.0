import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Envuelve la estrategia 'jwt' registrada en JwtStrategy.
// Se usa junto con RolesGuard: @UseGuards(JwtAuthGuard, RolesGuard)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
