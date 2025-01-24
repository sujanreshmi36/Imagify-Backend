import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';

import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDTO } from './dto/login';



@Controller('auth')
@ApiTags('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  //verify token and register the user
  @Post('register')
  create(
    @Body() createuserdto: CreateUserDto,
  ) {

    return this.authService.create(createuserdto);
  }

  // //login
  // @Post('login')
  // login(@Body() loginDTO: LoginDTO) {
  //   return this.authService.login(loginDTO);
  // }


  // //forgot-password
  // @Post('forgot-password')
  // forgot(@Body() body: { email: string }) {
  //   return this.authService.forgot(body.email);
  // }

  // //rest-password
  // @Post('reset-password')
  // reset(
  //   @Body() body: { password: string },
  //   @Headers('Authorization') token: string,
  // ) {
  //   return this.authService.reset(body.password, token);
  // }
}
