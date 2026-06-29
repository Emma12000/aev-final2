import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { DocumentsModule } from './documents/documents.module';
import { ActivityModule } from './activity/activity.module';
import { AccessModule } from './access/access.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AdminModule } from './admin/admin.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    TerminusModule,
    PrismaModule,
    ActivityModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    DocumentsModule,
    AccessModule,
    FavoritesModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
