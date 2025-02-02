import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDTO } from './dto/login';
import { MailDto, passwordDto } from './dto/create-auth.dto';
import { UtGuard } from 'src/middleware/guard/Ut.guard';



@Controller('auth')
@ApiTags('Auth')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  //verify token and register the user
  @Post('register')
  create(
    @Body() createuserdto: CreateUserDto,
  ) {

    return this.authService.create(createuserdto);
  }

  //login
  @Post('login')
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }


  // //forgot-password
  @Post('forgot-password')
  forgot(@Body() body: MailDto) {
    return this.authService.forgotPassword(body);
  }

  @Patch('update-password')
  @UseGuards(UtGuard)
  @ApiBearerAuth('access-token')
  updatePassword(@Req() req: any, @Body() passwordDto: passwordDto) {
    return this.authService.updatePassword(req.user, passwordDto);
  }
}
