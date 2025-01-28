import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AtGuard } from 'src/middleware/guard/At.guard';
import { ApiBearerAuth } from '@nestjs/swagger';


@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('initiate')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  async initiatePayment(
    @Body() createPaymentDto: CreatePaymentDto, @Req() req: any
  ) {
    const { plan } = createPaymentDto;
    const userId = req.user.id;

    if (!plan) {
      throw new BadRequestException('Plan is required');
    }
    let amount, credits;
    switch (plan) {
      case 'Basic':
        amount = 10 * 139;
        credits = 100
        break;
      case 'Advanced':
        amount = 50 * 139
        credits = 500
        break;
      case 'Business':
        amount = 250 * 139
        credits = 5000
        break;
      default:
        return {
          success: false,
          message: "Plan not found"
        }
    }

    try {
      const paymentUrl = await this.paymentService.initiatePayment(amount, userId, credits, plan);
      return {
        status: HttpStatus.OK,
        url: paymentUrl
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    };
  }

  @Patch('change-payment/:token')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  changePayment(@Req() req: any, @Param('token') token: string) {
    const userId = req.user.id;
    return this.paymentService.changePayment(userId, token);
  }
}


