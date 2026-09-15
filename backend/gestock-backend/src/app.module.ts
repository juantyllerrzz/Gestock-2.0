import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { MovementsModule } from './movements/movements.module';
import { ForecastingModule } from './forecasting/forecasting.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MailerModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    MovementsModule,
    ForecastingModule,
  ],
})
export class AppModule {}
