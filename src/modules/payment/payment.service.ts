import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
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
    successUrl: "http://localhost:5173/payment-success",
    failureUrl: "http://localhost:5173/payment-failure",
    esewaPaymentUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    secret: "8gBm/:&EnhH.1/q",
  };



  async initiatePayment(amount: number, userId: string, credits: number, plan: string): Promise<string> {

    const payment = new paymentEntity();
    payment.amount = amount;
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
    const decoded = this.decodeToken('Bearer ' + token);
    console.log(decoded);

    // try {
    //   const user = await this.userRepo.findOne({ where: { id: userId } });
    //   console.log(user);

    //   if (user) {
    //     const payment = await this.paymentRepo.findOne({ where: { user: { id: userId } } });
    //     console.log(payment);

    //     if (payment) {
    //       payment.payment = true;
    //       await this.paymentRepo.save(payment);
    //       user.creditBalance = payment.credits;
    //       await this.userRepo.save(user);
    //       return {
    //         status: true
    //       }
    //     } else {
    //       throw new BadRequestException("payment not found")
    //     }
    //   } else {
    //     throw new BadRequestException("user not found")
    //   }
    // } catch (e) {
    //   throw new BadRequestException(e.message);
    // }
  }

  private decodeToken(token: string) {
    try {
      // Verify and decode the token using the secret key
      const decoded = this.jwtService.verify(token, {
        secret: this.esewaConfig.secret,
      });

      console.log(decoded);

      return { payload: decoded };  // Return the decoded payload
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
