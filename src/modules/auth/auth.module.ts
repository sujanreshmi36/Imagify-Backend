import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';
import { hash } from 'src/helper/utils/hash';
import { Token } from 'src/helper/utils/token';
import { JwtService } from '@nestjs/jwt';
import { AtStrategy } from 'src/middleware/strategies/jwt.strategy';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, hash, Token, JwtService, AtStrategy],
})
export class AuthModule { }
