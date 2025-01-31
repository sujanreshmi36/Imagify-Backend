import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { log } from 'console';
import * as crypto from 'crypto';
import { paymentEntity } from 'src/model/payment.entity';
import { User } from 'src/model/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(paymentEntity)
    private paymentRepo: Repository<paymentEntity>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly jwtService: JwtService
  ) { }
  private esewaConfig = {
    merchantId: 'EPAYTEST',
    successUrl: "https://imagify-frontend-rosy.vercel.app/payment-success",
    failureUrl: "https://imagify-frontend-rosy.vercel.app/payment-failure",
    esewaPaymentUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    secret: "8gBm/:&EnhH.1/q",
  };



  async initiatePayment(amount: number, userId: string, credits: number, plan: string): Promise<string> {

    const payment = new paymentEntity();
    payment.amount = amount;
    console.log(credits);

    payment.credits = credits;
    payment.plan = plan;
    payment.user = { id: userId } as User
    await this.paymentRepo.save(payment);
    // Ensure unique transaction UUID for each attempt
    const uniqueOrderId = payment.id;
    let paymentData = {
      amount: amount.toString(),
      failure_url: this.esewaConfig.failureUrl,
      product_delivery_charge: '0',
      product_service_charge: '0',
      product_code: this.esewaConfig.merchantId,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      success_url: this.esewaConfig.successUrl,
      tax_amount: '0',
      total_amount: amount.toString(),
      transaction_uuid: uniqueOrderId,
    } as any;


    const data = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;

    // Generate HMAC SHA256 signature
    const signature = this.generateHash(data, this.esewaConfig.secret);
    paymentData = { ...paymentData, signature };
    try {
      const response = await axios.post(this.esewaConfig.esewaPaymentUrl, null, {
        params: paymentData,
      });

      // Extract payment URL from the response
      const paymentUrl = response.request.res.responseUrl;
      return paymentUrl;

    } catch (error) {
      console.error('eSewa Payment Error:', error.message);
      throw new Error('Payment initiation failed');
    }
  }

  //Method to generatehash
  private generateHash(data: string, secret: string): string {
    if (!data || !secret) {
      throw new Error('Both data and secret are required to generate a hash.');
    }

    const hash = crypto.createHmac('sha256', secret).update(data).digest('base64');
    return hash;
  }


  async changePayment(userId: string, token: string) {
    const decodeEsewaResponse = (token: string): any => {
      const jsonString = Buffer.from(token, 'base64').toString('utf-8');
      return JSON.parse(jsonString);
    };
    const decodedData = decodeEsewaResponse(token);
    const { transaction_uuid } = decodedData;

    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (user) {
        const payment = await this.paymentRepo.findOne({ where: { user: { id: userId }, id: transaction_uuid } });
        console.log(payment);

        if (payment) {
          payment.payment = true;
          await this.paymentRepo.save(payment);
          if (user.creditBalance !== 0) {
            user.creditBalance += payment.credits;
          } else {
            user.creditBalance = payment.credits
          }

          await this.userRepo.save(user);
          return {
            status: true
          }
        } else {
          throw new BadRequestException("payment not found")
        }
      } else {
        throw new BadRequestException("user not found")
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
