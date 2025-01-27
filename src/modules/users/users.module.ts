import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AtStrategy } from 'src/middleware/strategies/jwt.strategy';
import { HttpModule, HttpService } from '@nestjs/axios';
import axios, { Axios } from 'axios';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
