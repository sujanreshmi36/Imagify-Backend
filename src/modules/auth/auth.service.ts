import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'src/helper/utils/hash';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDTO } from './dto/login';
import { Token } from 'src/helper/utils/token';

Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private hash: hash,
    private token: Token
  ) { }
  //register
  async create(signupDTO: CreateUserDto) {
    try {

      const existingUser = await this.userRepo.findOne({ where: { email: signupDTO.email } });

      if (existingUser) {
        throw new ConflictException('Email address is already in use');
      }
      const hashedPassword = await this.hash.value(signupDTO.password);
      const user = new User();
      user.email = signupDTO.email;
      user.password = hashedPassword;
      user.name = signupDTO.name;
      const savedUser = await this.userRepo.save(user);
      return {
        message: "Registered Successfully.",
        success: true,
        data: savedUser
      }

    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }




  // login
  async login(loginDto: LoginDTO) {
    try {
      const user = await this.userRepo.findOne({
        where: { email: loginDto.email }
      });
      if (!user) {
        throw new NotFoundException("User doesn't exist");
      } else {
        const passwordMatched = await this.hash.verifyHashing(user.password, loginDto.password);
        if (!passwordMatched) {
          throw new ForbiddenException("Invalid email or password")
        }

        const access_token = await this.token.generateAcessToken({ id: user.id, email: user.email })
        return { message: "Logged in successfully.", token: access_token, user: user.name, status: true }
      }

    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  //forgotpassword
  // async forgot(email: string) {
  //   try {
  //     const user = await this.userRepo.findOne({ where: { email: email } });
  //     if (!user) {
  //       throw new NotFoundException("User not found.");
  //     } else {
  //       //generating token
  //       const passkey = this.config.get<string>('PASS_KEY');
  //       const frontURL = this.config.get<string>('frontURL');
  //       const token = jwt.sign({ email }, passkey, {
  //         expiresIn: '1d'
  //       });
  //       const url = `${frontURL}/auth/reset-password/${token}`;
  //       const sendMail = await this.mailerService.sendMail({
  //         to: email,
  //         subject: 'Reset your password',
  //         text: `To reset your password, click on the following link: ${url}`,
  //       });
  //       if (!sendMail) {
  //         throw new HttpException("couldnot send mail", HttpStatus.EXPECTATION_FAILED);
  //       } else {
  //         return "verification mail has been sent";
  //       }
  //     }
  //   } catch (e) {
  //     throw new BadRequestException(e.message);
  //   }

  // }

  //reset-password
  // async reset(newPassword: string, token: string) {
  //   try {
  //     if (!token) {
  //       throw new NotFoundException("Token not found");
  //     } else {
  //       token = token.split(' ')[1];
  //       const passkey = this.config.get<string>('PASS_KEY');
  //       let decodedToken;
  //       decodedToken = jwt.verify(token, passkey)
  //       if (!decodedToken) {
  //         return ({ message: "Token verification failed" });
  //       } else {
  //         const { email } = decodedToken;
  //         const salt = 10;
  //         const hashedPassword = await newPassword.hash(newPassword, salt);
  //         const user = await this.userRepo.findOne({ where: { email: email } });
  //         user.password = hashedPassword;
  //         return {
  //           data: await this.userRepo.save(user),
  //           message: "Password changed successfully"
  //         }
  //       }
  //     }
  //   } catch (e) {
  //     throw new BadRequestException(e.message);
  //   }

  // }
}