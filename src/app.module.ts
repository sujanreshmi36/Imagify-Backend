import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/pg.config';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), TypeOrmModule.forRoot(databaseConfig), AuthModule, UsersModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
