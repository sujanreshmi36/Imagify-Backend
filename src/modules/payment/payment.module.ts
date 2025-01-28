import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { paymentEntity } from 'src/model/payment.entity';
import { User } from 'src/model/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, paymentEntity])],
  controllers: [PaymentController],
  providers: [PaymentService, ConfigService, JwtService],
  exports: [PaymentService],
})
export class PaymentModule { }
